"use client";

import { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

import type { Resource, ResourceCategory } from "@/types/resource";

type ResourceFormProps = {
  initialData?: Resource;
  onSubmit: (data: ResourceFormData) => Promise<void>;
};

export type ResourceFormData = {
  name: string;
  description: string;
  category: ResourceCategory;
  location: string;
  capacity: number;
};

const initialFormData: ResourceFormData = {
  name: "",
  description: "",
  category: "MEETING_ROOM",
  location: "",
  capacity: 1,
};

const categoryOptions: {
  label: string;
  value: ResourceCategory;
}[] = [
  { label: "Meeting Room", value: "MEETING_ROOM" },
  { label: "Equipment", value: "EQUIPMENT" },
  { label: "Workspace", value: "WORKSPACE" },
];

export function ResourceForm({ initialData, onSubmit }: ResourceFormProps) {
  const [formData, setFormData] = useState<ResourceFormData>(
    initialData
      ? {
          name: initialData.name,
          description: initialData.description ?? "",
          category: initialData.category,
          location: initialData.location ?? "",
          capacity: initialData.capacity,
        }
      : initialFormData,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  function updateField<K extends keyof ResourceFormData>(
    field: K,
    value: ResourceFormData[K],
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (formData.name.trim().length < 2) {
      setError("Resource name must contain at least 2 characters.");
      return;
    }

    if (!Number.isInteger(formData.capacity) || formData.capacity < 1) {
      setError("Capacity must be a whole number greater than zero.");
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save the resource. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <form
      onSubmit={handleSubmit}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-slate-900">
          Resource Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide the details needed to identify and reserve this resource.
        </p>
      </div>

      <div className="space-y-5 p-5 sm:p-6">
        <div>
          <label
            htmlFor="name"
            className="text-sm font-semibold text-slate-700"
          >
            Resource name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            required
            minLength={2}
            maxLength={100}
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Conference Room A"
            className={inputClassName}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="text-sm font-semibold text-slate-700"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(event) =>
              updateField("category", event.target.value as ResourceCategory)
            }
            className={inputClassName}
          >
            {categoryOptions.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="description"
            className="text-sm font-semibold text-slate-700"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={500}
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Describe the resource and its intended use..."
            className={inputClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="text-sm font-semibold text-slate-700"
            >
              Location
            </label>
            <input
              id="location"
              maxLength={150}
              value={formData.location}
              onChange={(event) => updateField("location", event.target.value)}
              placeholder="e.g. Main office, Floor 2"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="capacity"
              className="text-sm font-semibold text-slate-700"
            >
              Capacity <span className="text-red-500">*</span>
            </label>
            <input
              id="capacity"
              type="number"
              required
              min={1}
              max={1000}
              step={1}
              value={formData.capacity}
              onChange={(event) =>
                updateField("capacity", Number(event.target.value))
              }
              className={inputClassName}
            />
            <p className="mt-1 text-xs text-slate-500">
              Maximum number of people or units supported.
            </p>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-100 bg-slate-50/70 p-5 sm:flex-row sm:items-center sm:px-6">
        <Link
          href="/resources"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <ArrowLeft size={16} />
          Cancel
        </Link>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={16} />
          {isSubmitting
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Resource"}
        </button>
      </div>
    </form>
  );
}
