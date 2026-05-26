const express = require("express");
const {
  listCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  searchCompanyDetails,
  companiesByCountry,
  getCompanyOptions,
} = require("../controllers/companyController");
const { requireFields } = require("../middleware/validate");

const router = express.Router();
const companyFields = [
  "companyName",
  "country",
  "city",
  "street",
  "houseNumber",
  "registrationDate",
  "managerSurname",
];

router.get("/", listCompanies);
router.get("/options", getCompanyOptions);
router.get("/details/search", searchCompanyDetails);
router.get("/by-country", companiesByCountry);
router.get("/:id", getCompany);
router.post("/", requireFields(companyFields), createCompany);
router.put("/:id", requireFields(companyFields), updateCompany);
router.delete("/:id", deleteCompany);

module.exports = router;
