import { prisma } from "@/lib/prisma";
import { mapReservation } from "@/lib/mappers/reservation-mapper";

type GetReservationsOptions = {
  userId?: string;
};

export async function getReservations(options: GetReservationsOptions = {}) {
  const reservations = await prisma.reservation.findMany({
    where: options.userId ? { userId: options.userId } : undefined,
    include: {
      resource: {
        select: {
          id: true,
          name: true,
          category: true,
          location: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { startTime: "desc" },
  });

  return reservations.map(mapReservation);
}
