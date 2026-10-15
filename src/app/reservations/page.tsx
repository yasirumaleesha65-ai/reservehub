import { Suspense } from "react";
import { connection } from "next/server";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { getReservations } from "@/lib/queries/reservations";
import { CancelReservationButton } from "@/components/reservations/cancel-reservation-button";
import { requireAuth } from "@/lib/auth/require-auth";
export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex min-h-screen">
        <Suspense
          fallback={
            <aside className="hidden w-64 shrink-0 border-r bg-white lg:block" />
          }
        >
          <AppSidebar />
        </Suspense>

        <main className="min-w-0 flex-1">
          <AppHeader
            title="Reservations"
            description="Workspace / Reservations"
          />

          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  Loading reservations...
                </div>
              }
            >
              <ReservationsContent />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}

async function ReservationsContent() {
  await connection();

  const user = await requireAuth();
  const reservations = user
    ? await getReservations(user.role === "ADMIN" ? {} : { userId: user.id })
    : [];
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          All reservations
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View scheduled resources and reservation details.
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h3 className="font-semibold text-slate-900">No reservations yet</h3>
          <p className="mt-2 text-sm text-slate-500">
            Create a reservation for an available resource to see it here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Resource</th>
                  <th className="px-6 py-4 font-medium">Reserved by</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Time</th>
                  <th className="px-6 py-4 font-medium">Purpose</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {reservations.map((reservation) => {
                  const start = new Date(reservation.startTime);
                  const end = new Date(reservation.endTime);

                  const date = start.toLocaleDateString();
                  const startTime = start.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const endTime = end.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <tr key={reservation.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900">
                          {reservation.resource.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {reservation.resource.location ||
                            "Location unspecified"}
                        </p>
                      </td>

                      <td className="px-6 py-4 text-slate-700">
                        {reservation.user.name}
                      </td>

                      <td className="px-6 py-4 text-slate-700">{date}</td>

                      <td className="whitespace-nowrap px-6 py-4 text-slate-700">
                        {startTime} – {endTime}
                      </td>

                      <td className="max-w-[200px] px-6 py-4 text-slate-600">
                        {reservation.purpose || "—"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            reservation.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {reservation.status === "CONFIRMED"
                            ? "Confirmed"
                            : "Cancelled"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {reservation.status === "CONFIRMED" ? (
                          <CancelReservationButton
                            reservationId={reservation.id}
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            No actions
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
