import "server-only";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

export async function getAuthenticatedUser() {
  const session = await getSession();

  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
}

export async function isAdmin() {
  const user = await getAuthenticatedUser();

  return user?.role === "ADMIN";
}
