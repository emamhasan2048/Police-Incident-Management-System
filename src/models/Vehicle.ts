import { Schema, model, models, type Types } from "mongoose";

export type Vehicle = {
  _id: string;
  registrationNumber: string;
  model: string;
  color: string;
  manufactureYear: number;
  driverId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const vehicleSchema = new Schema<Vehicle>(
  {
    registrationNumber: { type: String, required: true, trim: true, uppercase: true, unique: true },
    model: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
    manufactureYear: { type: Number, required: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  },
  { timestamps: true },
);

vehicleSchema.index({ driverId: 1 });
vehicleSchema.index({ model: 1, color: 1 });

export const VehicleModel = models.Vehicle || model<Vehicle>("Vehicle", vehicleSchema);
