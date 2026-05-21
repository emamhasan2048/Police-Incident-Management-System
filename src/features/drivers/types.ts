import { type DriverFormValues } from "@/lib/validations/drivers";

export type DriverRecord = DriverFormValues & {
  _id: string;
};

export type DriversResponse = {
  drivers?: DriverRecord[];
  message?: string;
};

export type DriverResponse = {
  driver?: DriverRecord;
  message?: string;
};
