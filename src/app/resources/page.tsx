import { Suspense } from "react";
import { connection } from "next/server";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResourceList } from "@/components/resources/resource-list";
import { ResourceListSkeleton } from "./resource-list-skeleton";
import { getResources } from "@/lib/queries/resources";
import { requireAuth } from "@/lib/auth/require-auth";
import { CreateResourceButton } from "@/components/resources/create-resource-button";

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1">
          <AppHeader title="Resources" description="Workspace / Resources" />

          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            <Suspense fallback={<ResourceListSkeleton />}>
              <ResourcesContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

async function ResourcesContent() {
  await requireAuth();
  await connection();

  const resources = await getResources();

  return (
    <>
      <div className="mb-6 flex justify-end">
        <CreateResourceButton />
      </div>

      <ResourceList resources={resources} />
    </>
  );
}
