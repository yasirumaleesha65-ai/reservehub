import { Suspense } from "react";

import { requireAdmin } from "@/lib/auth/require-auth";
import { AppSidebar } from "@/components/layout/app-sidebar";
import NewResourceForm from "./new-resource-form";

export default function NewResourcePage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex min-h-screen">
        <Suspense
          fallback={<aside className="hidden w-64 shrink-0 lg:block" />}
        >
          <AppSidebar />
        </Suspense>

        <main className="min-w-0 flex-1">
          <Suspense
            fallback={<div className="p-8">Loading resource form...</div>}
          >
            <NewResourceContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

async function NewResourceContent() {
  await requireAdmin();

  return <NewResourceForm />;
}
