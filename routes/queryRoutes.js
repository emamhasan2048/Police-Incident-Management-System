const express = require("express");
const {
  productsByCompany,
  companiesByProduct,
  productsByCountry,
  listCompanies,
  competitorsByProduct,
} = require("../controllers/queryController");

const router = express.Router();

router.get("/companies", listCompanies);
router.get("/companies/:companyId/products", productsByCompany);
router.get("/products/:productId/companies", companiesByProduct);
router.get("/countries/:country/products", productsByCountry);
router.get("/products/:productId/competitors", competitorsByProduct);

module.exports = router;
