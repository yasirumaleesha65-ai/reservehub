import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createResourceSchema } from "@/lib/validations/resource";
import { getAuthenticatedUser } from "@/lib/auth/authorization";

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(resources);
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch resources." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();

    if (!user) {
      return NextResponse.json(
        { message: "Please log in to create a resource." },
        { status: 401 },
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "Only administrators can create resources." },
        { status: 403 },
      );
    }
    const body: unknown = await request.json();
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

    const resource = await prisma.resource.create({
      data: {
        name: data.name,
        description: data.description || null,
        category: data.category,
        location: data.location || null,
        capacity: data.capacity,
      },
    });

    return NextResponse.json(
      { message: "Resource created successfully.", resource },
      { status: 201 },
    );
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

    return NextResponse.json(
      { message: "Unable to create the resource. Please try again." },
      { status: 500 },
    );
  }
}
