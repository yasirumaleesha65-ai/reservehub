import { z } from "zod";

const validCalendarDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const createReservationSchema = z.object({
  resourceId: z.string().min(1, "Please select a resource."),

  date: z
    .string()
    .refine(validCalendarDate, "Please provide a valid calendar date."),

  startTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please provide a valid start time."),

  endTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Please provide a valid end time."),

  purpose: z
    .string()
    .trim()
    .max(500, "Purpose cannot exceed 500 characters.")
    .optional()
    .default(""),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
