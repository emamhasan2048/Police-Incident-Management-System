import mongoose, { Schema, model, models } from "mongoose";

export type Driver = {
  _id: string;
  firstName: string;
  lastName: string;
  license: string;
  city: string;
  street: string;
  houseNumber: string;
  apartment?: number;
  createdAt: Date;
  updatedAt: Date;
};

const driverSchema = new Schema<Driver>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    license: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    houseNumber: { type: String, required: true, trim: true },
    apartment: { type: Number },
  },
  { timestamps: true },
);

driverSchema.index({ firstName: 1, lastName: 1 }, { unique: true });
driverSchema.index({ license: 1 });
driverSchema.index({ lastName: 1 });

if (models.Driver && !models.Driver.schema.path("houseNumber")) {
  mongoose.deleteModel("Driver");
}

export const DriverModel = models.Driver || model<Driver>("Driver", driverSchema);
