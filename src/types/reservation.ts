import type { ResourceCategory } from "@/types/resource";

export type ReservationStatus = "CONFIRMED" | "CANCELLED";

export type Reservation = {
  id: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  purpose: string | null;
  resource: {
    id: string;
    name: string;
    category: ResourceCategory;
    location: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
};
