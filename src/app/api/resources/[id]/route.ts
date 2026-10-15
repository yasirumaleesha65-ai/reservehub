import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createResourceSchema } from "@/lib/validations/resource";
import { updateResourceStatusSchema } from "@/lib/validations/resource-status";
import { getAuthenticatedUser } from "@/lib/auth/authorization";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    if (!resource) {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(resource);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch the resource." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to update a resource." },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only administrators can update resources." },
        { status: 403 },
      );
    }
    const body: unknown = await request.json();

    // Handle activation/deactivation requests separately.
    if (typeof body === "object" && body !== null && "isActive" in body) {
      const validation = updateResourceStatusSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { message: "Invalid resource status." },
          { status: 400 },
        );
      }

      const { isActive } = validation.data;

      const resource = await prisma.resource.findUnique({
        where: { id },
        select: { id: true, isActive: true },
      });

      if (!resource) {
        return NextResponse.json(
          { message: "Resource not found." },
          { status: 404 },
        );
      }

      // Prevent deactivation while reservations are ongoing
      // or scheduled for the future.
      if (!isActive && resource.isActive) {
        const reservationCount = await prisma.reservation.count({
          where: {
            resourceId: id,
            status: "CONFIRMED",
            endTime: {
              gt: new Date(),
            },
          },
        });

        if (reservationCount > 0) {
          return NextResponse.json(
            {
              message:
                "This resource cannot be deactivated because it has ongoing or upcoming confirmed reservations.",
            },
            { status: 409 },
          );
        }
      }

      const updatedResource = await prisma.resource.update({
        where: { id },
        data: { isActive },
      });

      return NextResponse.json({
        message: `Resource ${
          isActive ? "activated" : "deactivated"
        } successfully.`,
        resource: updatedResource,
      });
    }

    // Otherwise, handle the existing full resource edit.
    const validation = createResourceSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Please check the submitted resource details.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = validation.data;

    const resource = await prisma.resource.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        location: data.location || null,
        capacity: data.capacity,
      },
    });

    return NextResponse.json({
      message: "Resource updated successfully.",
      resource,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "A resource with this name already exists." },
        { status: 409 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { message: "Resource not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Unable to update the resource." },
      { status: 500 },
    );
  }
}
