"use client";

import { ResourceForm } from "@/components/resources/resource-form";

export function NewResourceForm() {
  async function handleSubmit(
    data: Parameters<React.ComponentProps<typeof ResourceForm>["onSubmit"]>[0],
  ) {
    console.log("Resource form submitted:", data);
  }

  return <ResourceForm onSubmit={handleSubmit} />;
}
