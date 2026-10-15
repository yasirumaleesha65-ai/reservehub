"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import { ResourceCard } from "@/components/resources/resource-card";
import type { Resource, ResourceCategory } from "@/types/resource";

type CategoryFilter = "All" | ResourceCategory;

type ResourceListProps = {
  resources: Resource[];
};

const categories: CategoryFilter[] = [
  "All",
  "MEETING_ROOM",
  "EQUIPMENT",
  "WORKSPACE",
];

const categoryLabels: Record<ResourceCategory, string> = {
  MEETING_ROOM: "Meeting rooms",
  EQUIPMENT: "Equipment",
  WORKSPACE: "Workspaces",
};

export function ResourceList({ resources }: ResourceListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All");

  const filteredResources = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(query) ||
        (resource.location ?? "").toLowerCase().includes(query) ||
        (resource.description ?? "").toLowerCase().includes(query);

      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  const activeCount = resources.filter((resource) => resource.isActive).length;

  return (
    <>
      <section className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Browse Resources
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Find the right room, equipment, or workspace for your next task.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <p className="text-xs text-slate-500">Active resources</p>
          <p className="mt-1 text-xl font-bold">
            {activeCount}
            <span className="ml-1 text-sm font-normal text-slate-400">
              / {resources.length} total
            </span>
          </p>
        </div>
      </section>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, description, or location..."
              aria-label="Search resources"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SlidersHorizontal size={18} className="shrink-0 text-slate-400" />

            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                aria-pressed={selectedCategory === category}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category === "All"
                  ? "All resources"
                  : categoryLabels[category]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredResources.length}
          </span>{" "}
          resources
        </p>

        {(searchQuery || selectedCategory !== "All") && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Clear filters
          </button>
        )}
      </div>

      {filteredResources.length > 0 ? (
        <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <Search className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-4 font-bold text-slate-800">No resources found</h3>
          <p className="mt-2 text-sm text-slate-500">
            Try another search term or choose a different category.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Reset filters
          </button>
        </section>
      )}
    </>
  );
}
