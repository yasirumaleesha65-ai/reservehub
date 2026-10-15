import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Users,
} from "lucide-react";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { ReservationTable } from "@/components/dashboard/reservation-table";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { getAuthenticatedUser } from "@/lib/auth/authorization";
import { requireAuth } from "@/lib/auth/require-auth";

import { Suspense } from "react";
import { connection } from "next/server";

import { getReservations } from "@/lib/queries/reservations";
import { prisma } from "@/lib/prisma";

export default function Home() {
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
          <AppHeader title="Overview" description="Workspace / Dashboard" />

          <div className="mx-auto max-w-[1500px] p-5 sm:p-8">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  Loading dashboard...
                </div>
              }
            >
              <DashboardContent />
            </Suspense>

            <footer className="mt-8 pb-2 text-center text-xs text-slate-400">
              ReserveHub · Resource Reservation Management
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

async function DashboardContent() {
  await connection();

  const user = await requireAuth();
  const [reservations, totalResources, activeResources] = await Promise.all([
    user
      ? getReservations(user.role === "ADMIN" ? {} : { userId: user.id })
      : Promise.resolve([]),
    prisma.resource.count(),
    prisma.resource.count({
      where: { isActive: true },
    }),
  ]);

  const now = new Date();

  const confirmedReservations = reservations.filter(
    (reservation) => reservation.status === "CONFIRMED",
  );

  const upcomingReservations = confirmedReservations.filter(
    (reservation) => new Date(reservation.startTime) > now,
  );

  const recentReservations = reservations.slice(0, 5);

  return (
    <>
      <WelcomeSection />

      <SummarySection
        totalResources={totalResources}
        totalReservations={confirmedReservations.length}
        upcomingReservations={upcomingReservations.length}
        availableResources={activeResources}
      />

      <section className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <ReservationTable reservations={recentReservations} />
        </div>

        <aside className="space-y-6">
          <QuickActions />
        </aside>
      </section>
    </>
  );
}

function WelcomeSection() {
  return (
    <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
      <div>
        <p className="mb-2 text-sm font-medium text-indigo-600">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>

        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Welcome back!
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Here&apos;s what&apos;s happening with your reservations.
        </p>
      </div>
    </section>
  );
}

type SummarySectionProps = {
  totalResources: number;
  totalReservations: number;
  upcomingReservations: number;
  availableResources: number;
};

function SummarySection({
  totalResources,
  totalReservations,
  upcomingReservations,
  availableResources,
}: SummarySectionProps) {
  return (
    <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        title="Total Resources"
        value={totalResources}
        description="Registered workspace resources"
        icon={Building2}
        iconStyle="bg-indigo-50 text-indigo-600"
      />

      <SummaryCard
        title="Confirmed Reservations"
        value={totalReservations}
        description="All confirmed bookings"
        icon={CalendarDays}
        iconStyle="bg-blue-50 text-blue-600"
      />

      <SummaryCard
        title="Upcoming Bookings"
        value={upcomingReservations}
        description="Confirmed reservations starting in the future"
        icon={Clock3}
        iconStyle="bg-amber-50 text-amber-600"
      />

      <SummaryCard
        title="Available Resources"
        value={availableResources}
        description="Active resources ready to reserve"
        icon={CheckCircle2}
        iconStyle="bg-emerald-50 text-emerald-600"
      />
    </section>
  );
}
