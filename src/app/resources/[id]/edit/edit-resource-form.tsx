"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

// import { AppHeader } from "@/components/layout/app-header";
// import { AppSidebar } from "@/components/layout/app-sidebar";
import { ResourceForm } from "@/components/resources/resource-form";
import type { Resource } from "@/types/resource";

type EditResourceFormProps = {
  id: string;
};

export default function EditResourceForm({ id }: EditResourceFormProps) {
  //   const params = useParams<{ id: string }>();
  const router = useRouter();

  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadResource() {
      try {
        const response = await fetch(`/api/resources/${id}`);
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Unable to load resource.");
        }

        setResource(result);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Unable to load resource.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadResource();
  }, [id]);

  async function handleUpdateResource(
    data: Parameters<React.ComponentProps<typeof ResourceForm>["onSubmit"]>[0],
  ) {
    const response = await fetch(`/api/resources/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Unable to update resource.");
    }

    router.push("/resources");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <div className="flex min-h-screen">
        {/* <AppSidebar /> */}

        <main className="min-w-0 flex-1">
          {/* <AppHeader
            title="Edit Resource"
            description="Workspace / Resources / Edit"
          /> */}

          <div className="mx-auto max-w-3xl p-5 sm:p-8">
            <Link
              href="/resources"
              className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to Resources
            </Link>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                <Pencil size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold">Edit Resource</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Update the resource details below.
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6">
                <div className="h-5 w-1/3 rounded bg-slate-200" />
                <div className="mt-5 h-11 rounded-xl bg-slate-100" />
                <div className="mt-5 h-5 w-1/3 rounded bg-slate-200" />
                <div className="mt-5 h-11 rounded-xl bg-slate-100" />
                <div className="mt-5 h-24 rounded-xl bg-slate-100" />
              </div>
            ) : error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
                <p className="font-semibold text-red-700">
                  Unable to load resource
                </p>
                <p className="mt-2 text-sm text-red-600">{error}</p>
                <button
                  type="button"
                  onClick={() => router.push("/resources")}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Back to Resources
                </button>
              </div>
            ) : resource ? (
              <ResourceForm
                key={resource.id}
                initialData={resource}
                onSubmit={handleUpdateResource}
              />
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}
