"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Building2,
  MapPin,
  Monitor,
  Pencil,
  Users,
} from "lucide-react";

import type { Resource, ResourceCategory } from "@/types/resource";
import { useAuth } from "@/app/context/auth-context";

type ResourceCardProps = {
  resource: Resource;
};

const categoryStyles: Record<ResourceCategory, string> = {
  MEETING_ROOM: "bg-indigo-50 text-indigo-700",
  EQUIPMENT: "bg-violet-50 text-violet-700",
  WORKSPACE: "bg-emerald-50 text-emerald-700",
};

const categoryLabels: Record<ResourceCategory, string> = {
  MEETING_ROOM: "Meeting Room",
  EQUIPMENT: "Equipment",
  WORKSPACE: "Workspace",
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");
  // const [isAdmin, setIsAdmin] = useState(false);

  const { user, isLoading } = useAuth();

  const isAdmin = !isLoading && user?.role === "ADMIN";

  const isActive = resource.isActive;

  const Icon =
    resource.category === "EQUIPMENT"
      ? Monitor
      : resource.category === "WORKSPACE"
        ? Users
        : Building2;

  async function handleToggleStatus() {
    setIsUpdating(true);
    setError("");

    try {
      const response = await fetch(`/api/resources/${resource.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isActive: !isActive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to update resource status.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update resource status.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            categoryStyles[resource.category]
          }`}
        >
          <Icon size={22} />
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-medium text-slate-500">
          {categoryLabels[resource.category]}
        </p>

        <h2 className="mt-1 text-lg font-bold text-slate-900">
          {resource.name}
        </h2>

        <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">
          {resource.description || "No description provided."}
        </p>
      </div>

      <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
        <p className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={16} className="shrink-0 text-slate-400" />
          {resource.location || "Location not specified"}
        </p>

        <p className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={16} className="shrink-0 text-slate-400" />
          Capacity: {resource.capacity}
        </p>
      </div>

      <div className="mt-auto space-y-2 pt-5">
        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
        {isAdmin && (
          <>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isUpdating}
              className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive
                  ? "border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
              }`}
            >
              {isUpdating
                ? "Updating..."
                : isActive
                  ? "Deactivate Resource"
                  : "Activate Resource"}
            </button>

            <Link
              href={`/resources/${resource.id}/edit`}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <Pencil size={16} />
              Edit Resource
            </Link>
          </>
        )}

        {isActive ? (
          <Link
            href={`/reservations/new?resourceId=${resource.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            View availability
            <ArrowUpRight size={16} />
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-400"
          >
            Currently unavailable
          </button>
        )}
      </div>
    </article>
  );
}
