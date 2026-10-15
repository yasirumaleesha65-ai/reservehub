import { NextResponse } from "next/server";

import { deleteSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await deleteSession();

    return NextResponse.json({
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("Logout failed:", error);

    return NextResponse.json(
      { message: "Unable to log out. Please try again." },
      { status: 500 },
    );
  }
}
