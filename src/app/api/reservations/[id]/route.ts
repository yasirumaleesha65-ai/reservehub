import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/auth/authorization";

type ReservationRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: ReservationRouteContext,
) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to cancel a reservation." },
        { status: 401 },
      );
    }
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { message: "Reservation ID is required." },
        { status: 400 },
      );
    }

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json(
        { message: "Reservation not found." },
        { status: 404 },
      );
    }
    if (reservation.userId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "You are not authorized to cancel this reservation." },
        { status: 403 },
      );
    }

    if (reservation.status === "CANCELLED") {
      return NextResponse.json(
        { message: "This reservation has already been cancelled." },
        { status: 409 },
      );
    }

    const updatedReservation = await prisma.reservation.update({
      where: { id },
      data: { status: "CANCELLED" },
    });

    return NextResponse.json({
      message: "Reservation cancelled successfully.",
      reservation: updatedReservation,
    });
  } catch (error) {
    console.error("Failed to cancel reservation:", error);

    return NextResponse.json(
      {
        message:
          "An unexpected error occurred while cancelling the reservation.",
      },
      { status: 500 },
    );
  }
}
