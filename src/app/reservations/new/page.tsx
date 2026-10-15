import { Suspense } from "react";
import { connection } from "next/server";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import Link from "next/link";
import { getAvailableResources } from "@/lib/queries/available-resources";
import { ResourceForm } from "@/components/reservations/resource-form";

type NewReservationPageProps = {
  searchParams: Promise<{
    resourceId?: string;
  }>;
};

export default function NewReservationPage({
  searchParams,
}: NewReservationPageProps) {
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
            title="New Reservation"
            description="Workspace / Reservations / New"
          />

          <div className="mx-auto max-w-3xl p-5 sm:p-8">
            <Suspense
              fallback={
                <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                  Loading reservation form...
                </div>
              }
            >
              <ReservationPageContent searchParams={searchParams} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

async function ReservationPageContent({
  searchParams,
}: NewReservationPageProps) {
  await connection();

  const { resourceId } = await searchParams;

  const resources = await getAvailableResources();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Create a reservation</h2>

      <p className="mt-2 text-sm text-slate-500">
        Choose a resource and reserve a suitable time.
      </p>

      {resources.length === 0 ? (
        <p className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          No active resources are currently available for reservation.
        </p>
      ) : (
        <ResourceForm
          resources={resources}
          selectedResourceId={resourceId ?? ""}
        />
      )}
    </div>
  );
}
