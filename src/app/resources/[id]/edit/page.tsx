import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import EditResourceForm from "./edit-resource-form";
import { requireAdmin } from "@/lib/auth/require-auth";

type EditResourcePageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditResourcePage({
  params,
}: EditResourcePageProps) {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex min-h-screen">
        <Suspense
          fallback={
            <aside className="min-h-screen w-64 border-r border-gray-200 bg-white" />
          }
        >
          <AppSidebar />
        </Suspense>

        <main className="min-w-0 flex-1">
          <AppHeader
            title="Edit Resource"
            description="Workspace / Resources / Edit"
          />

          <div className="mx-auto max-w-3xl p-5 sm:p-8">
            <Suspense
              fallback={
                <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                  Loading resource...
                </div>
              }
            >
              <EditResourceContent params={params} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

async function EditResourceContent({ params }: EditResourcePageProps) {
  await requireAdmin();
  const { id } = await params;

  return <EditResourceForm id={id} />;
}
