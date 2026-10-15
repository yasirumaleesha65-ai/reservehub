import type { Reservation as PrismaReservation } from "@/generated/prisma/client";
import type { Reservation } from "@/types/reservation";

type ReservationWithRelations = PrismaReservation & {
  resource: {
    id: string;
    name: string;
    category: "MEETING_ROOM" | "EQUIPMENT" | "WORKSPACE";
    location: string | null;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
};

export function mapReservation(
  reservation: ReservationWithRelations,
): Reservation {
  return {
    id: reservation.id,
    startTime: reservation.startTime.toISOString(),
    endTime: reservation.endTime.toISOString(),
    status: reservation.status,
    purpose: reservation.purpose,
    resource: {
      id: reservation.resource.id,
      name: reservation.resource.name,
      category: reservation.resource.category,
      location: reservation.resource.location,
    },
    user: {
      id: reservation.user.id,
      name: reservation.user.name,
      email: reservation.user.email,
    },
  };
}
