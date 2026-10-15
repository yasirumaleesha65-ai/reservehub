import { prisma } from "@/lib/prisma";
import { mapResource } from "@/lib/mappers/resource-mapper";

export async function getResources() {
  const resources = await prisma.resource.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return resources.map(mapResource);
}
