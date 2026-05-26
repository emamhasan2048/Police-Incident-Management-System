const express = require("express");
const {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  productsByCompany,
  productOffers,
} = require("../controllers/productController");
const { requireFields } = require("../middleware/validate");

const router = express.Router();

router.get("/", listProducts);
router.get("/by-company", productsByCompany);
router.get("/offers", productOffers);
router.get("/:id", getProduct);
router.post("/", requireFields(["productName"]), createProduct);
router.put("/:id", requireFields(["productName"]), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
