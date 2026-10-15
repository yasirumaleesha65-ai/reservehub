import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createReservationSchema } from "@/lib/validations/reservation";
import { Prisma } from "@/generated/prisma/client";
import { getAuthenticatedUser } from "@/lib/auth/authorization";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to create a reservation." },
        { status: 401 },
      );
    }
    const body: unknown = await request.json();

    const validation = createReservationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid reservation details.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { resourceId, date, startTime, endTime, purpose } = validation.data;

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    // Reject invalid dates and times.
    if (
      Number.isNaN(startDateTime.getTime()) ||
      Number.isNaN(endDateTime.getTime())
    ) {
      return NextResponse.json(
        { message: "Please provide a valid reservation date and time." },
        { status: 400 },
      );
    }

    if (startDateTime <= new Date()) {
      return NextResponse.json(
        { message: "The reservation must start in the future." },
        { status: 400 },
      );
    }

    if (endDateTime <= startDateTime) {
      return NextResponse.json(
        { message: "End time must be later than start time." },
        { status: 400 },
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource || !resource.isActive) {
      return NextResponse.json(
        { message: "This resource does not exist or is unavailable." },
        { status: 404 },
      );
    }

    // const demoEmployee = await prisma.user.findUnique({
    //   where: { email: "demo.employee@reservehub.test" },
    // });

    // if (!demoEmployee) {
    //   return NextResponse.json(
    //     { message: "The demo employee account was not found." },
    //     { status: 500 },
    //   );
    // }

    const result = await prisma.$transaction(
      async (tx) => {
        const overlappingReservation = await tx.reservation.findFirst({
          where: {
            resourceId,
            status: "CONFIRMED",
            startTime: { lt: endDateTime },
            endTime: { gt: startDateTime },
          },
        });

        if (overlappingReservation) {
          return { conflict: true as const };
        }

        const reservation = await tx.reservation.create({
          data: {
            userId: user.id,
            resourceId,
            startTime: startDateTime,
            endTime: endDateTime,
            purpose: purpose || null,
          },
          include: {
            resource: true,
          },
        });

        return {
          conflict: false as const,
          reservation,
        };
      },
      {
        isolationLevel: "Serializable",
      },
    );

    if (result.conflict) {
      return NextResponse.json(
        {
          message:
            "This resource is already reserved during the selected time.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        message: "Reservation created successfully.",
        reservation: result.reservation,
      },
      { status: 201 },
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2034"
    ) {
      return NextResponse.json(
        {
          message:
            "Another booking was processed at the same time. Please check availability and try again.",
        },
        { status: 409 },
      );
    }
  }
}
