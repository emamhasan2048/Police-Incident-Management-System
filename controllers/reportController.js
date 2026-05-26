const Offer = require("../models/Offer");
const Company = require("../models/Company");
const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const dashboardStats = asyncHandler(async (req, res) => {
  const [companies, products, offers, countries] = await Promise.all([
    Company.countDocuments(),
    Product.countDocuments(),
    Offer.countDocuments(),
    Company.distinct("country"),
  ]);

  const recentOffers = await Offer.find()
    .populate("company", "companyName country")
    .populate("product", "productName")
    .sort({ createdAt: -1 })
    .limit(6);

  res.json({
    success: true,
    data: {
      companies,
      products,
      offers,
      countries: countries.length,
      recentOffers,
    },
  });
});

const companyOffersReport = asyncHandler(async (req, res) => {
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
        _id: "$company._id",
        companyName: { $first: "$company.companyName" },
        country: { $first: "$company.country" },
        products: { $addToSet: "$product.productName" },
        offerCount: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
    { $sort: { companyName: 1 } },
  ]);

  res.json({ success: true, data: report });
});

const productOffersReport = asyncHandler(async (req, res) => {
  const report = await Offer.aggregate([
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
      $lookup: {
        from: "companies",
        localField: "company",
        foreignField: "_id",
        as: "company",
      },
    },
    { $unwind: "$company" },
    {
      $group: {
        _id: "$product._id",
        productName: { $first: "$product.productName" },
        productCode: { $first: "$product.productCode" },
        companies: { $addToSet: "$company.companyName" },
        countries: { $addToSet: "$company.country" },
        offerCount: { $sum: 1 },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    { $sort: { productName: 1 } },
  ]);

  res.json({ success: true, data: report });
});

const countryOffersReport = asyncHandler(async (req, res) => {
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
        _id: "$company.country",
        companies: { $addToSet: "$company.companyName" },
        products: { $addToSet: "$product.productName" },
        offerCount: { $sum: 1 },
        averagePrice: { $avg: "$price" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: report });
});

const competitorReport = asyncHandler(async (req, res) => {
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
        competitors: {
          $addToSet: {
            companyName: "$company.companyName",
            country: "$company.country",
            price: "$price",
            salesTerms: "$salesTerms",
          },
        },
      },
    },
    {
      $project: {
        productName: 1,
        competitors: 1,
        competitorCount: { $size: "$competitors" },
      },
    },
    { $match: { competitorCount: { $gt: 1 } } },
    { $sort: { productName: 1 } },
  ]);

  res.json({ success: true, data: report });
});

module.exports = {
  dashboardStats,
  companyOffersReport,
  productOffersReport,
  countryOffersReport,
  competitorReport,
};
