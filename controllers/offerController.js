const Offer = require("../models/Offer");
const asyncHandler = require("../middleware/asyncHandler");

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const listOffers = asyncHandler(async (req, res) => {
  const { search, companyId, productId, country } = req.query;
  const { page, limit, skip } = getPagination(req);
  const filter = {};

  if (companyId) filter.company = companyId;
  if (productId) filter.product = productId;

  const offers = await Offer.find(filter).populate("company").populate("product").sort({ createdAt: -1 });
  const countryFiltered = country ? offers.filter((offer) => offer.company?.country === country) : offers;
  const filtered = search
    ? countryFiltered.filter((offer) => {
        const text = [
          offer.company?.companyName,
          offer.company?.country,
          offer.product?.productName,
          offer.salesTerms,
          offer.notes,
        ]
          .join(" ")
          .toLowerCase();
        return text.includes(search.toLowerCase());
      })
    : countryFiltered;

  const paged = filtered.slice(skip, skip + limit);
  res.json({
    success: true,
    data: paged,
    page,
    pages: Math.ceil(filtered.length / limit),
    total: filtered.length,
  });
});

const getOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findById(req.params.id).populate("company").populate("product");
  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }
  res.json({ success: true, data: offer });
});

const createOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.create(req.body);
  const populated = await offer.populate(["company", "product"]);
  res.status(201).json({ success: true, data: populated });
});

const updateOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("company")
    .populate("product");

  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }

  res.json({ success: true, data: offer });
});

const deleteOffer = asyncHandler(async (req, res) => {
  const offer = await Offer.findByIdAndDelete(req.params.id);
  if (!offer) {
    res.status(404);
    throw new Error("Offer not found");
  }
  res.json({ success: true, data: offer });
});

const offersByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const filter = productId ? { product: productId } : {};
  const offers = await Offer.find(filter).populate("company").populate("product").sort({ price: 1 });
  res.json({ success: true, data: offers });
});

const offersByCountry = asyncHandler(async (req, res) => {
  const { country } = req.query;
  const pipeline = [
    {
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    ...(country ? [{ $match: { "company.country": country } }] : []),
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    { $sort: { "company.country": 1, createdAt: -1 } },
  ];

  const offers = await Offer.aggregate(pipeline);
  res.json({ success: true, data: offers });
});

module.exports = {
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  offersByProduct,
  offersByCountry,
};
