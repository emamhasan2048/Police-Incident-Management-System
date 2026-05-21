import { z } from "zod";
import { cityOptions, cityStreetOptions } from "@/lib/driver-location-options";

export const driverFormSchema = z
  .object({
    firstName: z.string().trim().min(1, "Enter the driver's first name."),
    lastName: z.string().trim().min(1, "Enter the driver's last name."),
    license: z.string().trim().min(1, "Enter a license number."),
    city: z.string().trim().min(1, "Choose a city.").refine((city) => cityOptions.includes(city), "Choose a valid city."),
    street: z.string().trim().min(1, "Choose a street."),
    houseNumber: z.string().trim().min(1, "Enter a house number."),
    apartment: z.number().int("Apartment must be a whole number.").positive("Apartment must be greater than 0.").optional(),
  })
  .superRefine((driver, context) => {
    if (!(cityStreetOptions[driver.city] ?? []).includes(driver.street)) {
      context.addIssue({
        code: "custom",
        message: "Choose a valid street for the selected city.",
        path: ["street"],
      });
    }
  });

export const driverDetailsSearchSchema = z.object({
  query: z.string().trim().min(1, "Enter a last name or license number."),
});

export const driverViolationsSearchSchema = z.object({
  lastName: z.string().trim().min(1, "Enter a driver last name."),
});

export type DriverFormValues = z.infer<typeof driverFormSchema>;
export type DriverDetailsSearchValues = z.infer<typeof driverDetailsSearchSchema>;
export type DriverViolationsSearchValues = z.infer<typeof driverViolationsSearchSchema>;
