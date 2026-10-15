import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createReservationSchema } from "@/lib/validations/reservation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const validation = createReservationSchema.safeParse({
      resourceId: searchParams.get("resourceId") ?? "",
      date: searchParams.get("date") ?? "",
      startTime: searchParams.get("startTime") ?? "",
      endTime: searchParams.get("endTime") ?? "",
      purpose: "",
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          message:
            validation.error.issues[0]?.message ??
            "Invalid availability request.",
        },
        { status: 400 },
      );
    }

    const { resourceId, date, startTime, endTime } = validation.data;

    const startDateTime = new Date(`${date}T${startTime}:00`);
    const endDateTime = new Date(`${date}T${endTime}:00`);

    if (
      Number.isNaN(startDateTime.getTime()) ||
      Number.isNaN(endDateTime.getTime()) ||
      startDateTime <= new Date() ||
      endDateTime <= startDateTime
    ) {
      return NextResponse.json(
        { message: "Please provide a future date and a valid time range." },
        { status: 400 },
      );
    }

    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, name: true, isActive: true },
    });

    if (!resource) {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 },
      );
    }

    if (!resource.isActive) {
      return NextResponse.json(
        { message: "This resource is currently inactive." },
        { status: 409 },
      );
    }

    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        resourceId,
        status: "CONFIRMED",
        startTime: { lt: endDateTime },
        endTime: { gt: startDateTime },
      },
      select: { id: true },
    });

    return NextResponse.json({
      resource: { id: resource.id, name: resource.name },
      available: !conflictingReservation,
      message: conflictingReservation
        ? "This resource is already reserved during the selected time."
        : "This resource is available for the selected time.",
    });
  } catch (error) {
    console.error("Availability check failed:", error);

    return NextResponse.json(
      { message: "Unable to check availability. Please try again." },
      { status: 500 },
    );
  }
}
