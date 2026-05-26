const Company = require("../models/Company");
const Offer = require("../models/Offer");
const asyncHandler = require("../middleware/asyncHandler");

const toRegex = (value) => new RegExp(String(value || "").trim(), "i");

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const listCompanies = asyncHandler(async (req, res) => {
  const { search, country } = req.query;
  const { page, limit, skip } = getPagination(req);
  const filter = {};

  if (search) filter.companyName = toRegex(search);
  if (country) filter.country = country;

  const [items, total] = await Promise.all([
    Company.find(filter).sort({ companyName: 1 }).skip(skip).limit(limit),
    Company.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, page, pages: Math.ceil(total / limit), total });
});

const getCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }
  res.json({ success: true, data: company });
});

const createCompany = asyncHandler(async (req, res) => {
  const exists = await Company.findOne({
    companyName: new RegExp(`^${req.body.companyName.trim()}$`, "i"),
  });

  if (exists) {
    res.status(409);
    throw new Error("Company name already exists");
  }

  const company = await Company.create(req.body);
  res.status(201).json({ success: true, data: company });
});

const updateCompany = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  if (req.body.companyName) {
    const duplicate = await Company.findOne({
      _id: { $ne: req.params.id },
      companyName: new RegExp(`^${req.body.companyName.trim()}$`, "i"),
    });

    if (duplicate) {
      res.status(409);
      throw new Error("Company name already exists");
    }
  }

  Object.assign(company, req.body);
  const saved = await company.save();
  res.json({ success: true, data: saved });
});

const deleteCompany = asyncHandler(async (req, res) => {
  const offerCount = await Offer.countDocuments({ company: req.params.id });
  if (offerCount > 0) {
    res.status(409);
    throw new Error("Delete related offers before deleting this company");
  }

  const company = await Company.findByIdAndDelete(req.params.id);
  if (!company) {
    res.status(404);
    throw new Error("Company not found");
  }

  res.json({ success: true, data: company });
});

const searchCompanyDetails = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const companies = await Company.find(q ? { companyName: toRegex(q) } : {})
    .sort({ companyName: 1 })
    .limit(25);

  res.json({ success: true, data: companies });
});

const companiesByCountry = asyncHandler(async (req, res) => {
  const { country } = req.query;
  const filter = country ? { country } : {};
  const companies = await Company.find(filter).sort({ companyName: 1 });
  res.json({ success: true, data: companies });
});

const getCompanyOptions = asyncHandler(async (req, res) => {
  const countries = await Company.distinct("country");
  res.json({ success: true, data: { countries: countries.sort() } });
});

module.exports = {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanyDetails,
  companiesByCountry,
  getCompanyOptions,
};
