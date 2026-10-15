import Link from "next/link";
import { ArrowUpRight, Building2, CalendarDays, Plus } from "lucide-react";

const actions = [
  {
    href: "/reservations/new",
    icon: Plus,
    title: "Book a resource",
    description: "Create a new reservation",
  },
  {
    href: "/resources",
    icon: Building2,
    title: "Browse resources",
    description: "Find rooms and equipment",
  },
  {
    href: "/reservations",
    icon: CalendarDays,
    title: "My reservations",
    description: "Review your bookings",
  },
];

export function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-bold">Quick Actions</h3>
        <ArrowUpRight size={18} className="text-slate-400" />
      </div>

      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-indigo-100 hover:bg-indigo-50/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-indigo-100 group-hover:text-indigo-700">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight
                size={16}
                className="shrink-0 text-slate-400 transition group-hover:text-indigo-600"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
