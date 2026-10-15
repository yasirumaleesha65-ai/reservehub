import type { Resource as PrismaResource } from "@/generated/prisma/client";
import type { Resource } from "@/types/resource";

export function mapResource(resource: PrismaResource): Resource {
  return {
    id: resource.id,
    name: resource.name,
    description: resource.description,
    category: resource.category,
    location: resource.location,
    capacity: resource.capacity,
    isActive: resource.isActive,
  };
}
