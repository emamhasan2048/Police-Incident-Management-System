const Offer = require("../models/Offer");
const Company = require("../models/Company");
const asyncHandler = require("../middleware/asyncHandler");

const productsByCompany = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ company: req.params.companyId })
    .populate("product")
    .populate("company", "companyName country")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: offers });
});

const companiesByProduct = asyncHandler(async (req, res) => {
  const offers = await Offer.find({ product: req.params.productId })
    .populate("company")
    .populate("product")
    .sort({ price: 1 });

  res.json({ success: true, data: offers });
});

const productsByCountry = asyncHandler(async (req, res) => {
  const { country } = req.params;
  const report = await Offer.aggregate([
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    { $match: { "company.country": country } },
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product._id",
        productName: { $first: "$product.productName" },
        productCode: { $first: "$product.productCode" },
        companies: { $addToSet: "$company.companyName" },
        offerCount: { $sum: 1 },
      },
    },
    { $sort: { productName: 1 } },
  ]);

  res.json({ success: true, data: report });
});

const listCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ companyName: 1 });
  res.json({ success: true, data: companies });
});

const competitorsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const offers = await Offer.find({ product: productId })
    .populate("company")
    .populate("product")
    .sort({ price: 1 });

  res.json({ success: true, data: offers });
});

module.exports = {
  productsByCompany,
  companiesByProduct,
  productsByCountry,
  listCompanies,
  competitorsByProduct,
};
