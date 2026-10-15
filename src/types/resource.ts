export type ResourceCategory = "MEETING_ROOM" | "EQUIPMENT" | "WORKSPACE";
export type Resource = {
  id: string;
  name: string;
  description: string | null;
  category: ResourceCategory;
  location: string | null;
  capacity: number;
  isActive: boolean;
};
