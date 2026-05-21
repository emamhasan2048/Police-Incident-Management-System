import { Schema, model, models, type Model, type Types } from "mongoose";

export type Violation = {
  _id?: Types.ObjectId;
  violationMessage: string;
  date: Date;
  violationCode: string;
  driverId: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
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

const existingViolationModel = models.Violation as Model<Violation> | undefined;

export const ViolationModel = existingViolationModel ?? model<Violation>("Violation", violationSchema);
