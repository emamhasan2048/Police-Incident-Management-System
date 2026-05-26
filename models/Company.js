const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    street: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    houseNumber: {
      type: String,
      required: [true, "House number is required"],
      trim: true,
    },
    registrationDate: {
      type: Date,
      required: [true, "Registration date is required"],
    },
    managerSurname: {
      type: String,
      required: [true, "Manager surname is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

companySchema.index({ companyName: "text", country: 1, city: 1 });

module.exports = mongoose.model("Company", companySchema);
