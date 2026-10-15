"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useAuth } from "@/app/context/auth-context";

export function CreateResourceButton() {
  const { user, isLoading } = useAuth();
  // console.log("Auth Context:", { user, isLoading });

  if (isLoading || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <Link
      href="/resources/new"
      className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700"
    >
      <Plus size={16} />
      Create Resource
    </Link>
  );
}
