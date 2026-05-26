const express = require("express");
const {
  listOffers,
  getOffer,
  createOffer,
  updateOffer,
  deleteOffer,
  offersByProduct,
  offersByCountry,
} = require("../controllers/offerController");
const { requireFields } = require("../middleware/validate");

const router = express.Router();
const offerFields = ["company", "product", "price", "salesTerms"];

router.get("/", listOffers);
router.get("/by-product", offersByProduct);
router.get("/by-country", offersByCountry);
router.get("/:id", getOffer);
router.post("/", requireFields(offerFields), createOffer);
router.put("/:id", requireFields(offerFields), updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
