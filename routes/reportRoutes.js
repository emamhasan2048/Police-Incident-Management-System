const express = require("express");
const {
  dashboardStats,
  companyOffersReport,
  productOffersReport,
  countryOffersReport,
  competitorReport,
} = require("../controllers/reportController");

const router = express.Router();

router.get("/dashboard", dashboardStats);
router.get("/company-offers", companyOffersReport);
router.get("/product-offers", productOffersReport);
router.get("/country-offers", countryOffersReport);
router.get("/competitors", competitorReport);

module.exports = router;
