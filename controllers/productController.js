const Product = require("../models/Product");
const Offer = require("../models/Offer");
const asyncHandler = require("../middleware/asyncHandler");

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  return { page, limit, skip: (page - 1) * limit };
};

const listProducts = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const { page, limit, skip } = getPagination(req);
  const filter = search
    ? { $or: [{ productName: new RegExp(search, "i") }, { productCode: new RegExp(search, "i") }] }
    : {};

  const [items, total] = await Promise.all([
    Product.find(filter).sort({ productName: 1 }).skip(skip).limit(limit),
    Product.countDocuments(filter),
  ]);

  res.json({ success: true, data: items, page, pages: Math.ceil(total / limit), total });
});

const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json({ success: true, data: product });
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, data: product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const offerCount = await Offer.countDocuments({ product: req.params.id });
  if (offerCount > 0) {
    res.status(409);
    throw new Error("Delete related offers before deleting this product");
  }

  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json({ success: true, data: product });
});

const productsByCompany = asyncHandler(async (req, res) => {
  const { companyId } = req.query;
  const match = companyId ? { company: companyId } : {};
  const offers = await Offer.find(match)
    .populate("product")
    .populate("company", "companyName country")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: offers });
});

const productOffers = asyncHandler(async (req, res) => {
  const { productId } = req.query;
  const match = productId ? { product: productId } : {};
  const offers = await Offer.find(match)
    .populate("product")
    .populate("company")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: offers });
});

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productsByCompany,
  productOffers,
};
