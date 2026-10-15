import { prisma } from "@/lib/prisma";
import { mapResource } from "@/lib/mappers/resource-mapper";

export async function getAvailableResources() {
  const resources = await prisma.resource.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return resources.map(mapResource);
}
