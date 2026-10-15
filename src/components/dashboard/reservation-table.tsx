import Link from "next/link";
import { Building2, Monitor } from "lucide-react";

import type { Reservation } from "@/types/reservation";

type ReservationTableProps = {
  reservations: Reservation[];
};

function getCategoryLabel(category: Reservation["resource"]["category"]) {
  switch (category) {
    case "MEETING_ROOM":
      return "Meeting room";
    case "EQUIPMENT":
      return "Equipment";
    case "WORKSPACE":
      return "Workspace";
  }
}

export function ReservationTable({ reservations }: ReservationTableProps) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
        <div>
          <h3 className="font-bold">Recent Reservations</h3>
          <p className="mt-1 text-sm text-slate-500">
            Keep track of the latest bookings.
          </p>
        </div>

        <Link
          href="/reservations"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all
        </Link>
      </div>

      {reservations.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="font-medium text-slate-700">No reservations yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Reservations will appear here once a resource is booked.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4 font-semibold">Resource</th>
                <th className="px-5 py-4 font-semibold">Date &amp; time</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((reservation) => {
                const start = new Date(reservation.startTime);
                const end = new Date(reservation.endTime);
                const isConfirmed = reservation.status === "CONFIRMED";
                const isEquipment =
                  reservation.resource.category === "EQUIPMENT";

                return (
                  <tr
                    key={reservation.id}
                    className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            isEquipment
                              ? "bg-blue-50 text-blue-600"
                              : "bg-indigo-50 text-indigo-600"
                          }`}
                        >
                          {isEquipment ? (
                            <Monitor size={19} />
                          ) : (
                            <Building2 size={19} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="whitespace-nowrap font-semibold text-slate-800">
                            {reservation.resource.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {getCategoryLabel(reservation.resource.category)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {start.toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {start.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {" – "}
                        {end.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${
                          isConfirmed
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            isConfirmed ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {isConfirmed ? "Confirmed" : "Cancelled"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-4">
        <p className="text-xs text-slate-500">
          Showing {reservations.length} recent reservations
        </p>

        <Link
          href="/reservations"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Manage bookings
        </Link>
      </div>
    </section>
  );
}
