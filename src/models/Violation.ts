import { Schema, model, models, type Types } from "mongoose";

export type Violation = {
  _id: string;
  violationMessage: string;
  date: Date;
  violationCode: string;
  driverId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const violationSchema = new Schema<Violation>(
  {
    violationMessage: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    violationCode: { type: String, required: true, trim: true, uppercase: true },
    driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  },
  { timestamps: true },
);

violationSchema.index({ driverId: 1, date: -1 });
violationSchema.index({ violationCode: 1 });

export const ViolationModel = models.Violation || model<Violation>("Violation", violationSchema);
