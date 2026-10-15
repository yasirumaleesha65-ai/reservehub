"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResourceForm } from "@/components/resources/resource-form";

export default function NewResourceForm() {
  const router = useRouter();

  async function handleCreateResource(
    data: Parameters<React.ComponentProps<typeof ResourceForm>["onSubmit"]>[0],
  ) {
    const response = await fetch("/api/resources", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create resource.");
    }

    router.push("/resources");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen">
      {/* <AppSidebar /> */}

      <main className="min-w-0 flex-1">
        <AppHeader
          title="Add Resource"
          description="Workspace / Resources / New"
        />

        <div className="mx-auto max-w-3xl p-5 sm:p-8">
          <Link
            href="/resources"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </Link>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
              <PackagePlus size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Add a New Resource</h2>
              <p className="mt-1 text-sm text-slate-500">
                Register a room, workspace, or piece of equipment.
              </p>
            </div>
          </div>

          <ResourceForm onSubmit={handleCreateResource} />
        </div>
      </main>
    </div>
  );
}
