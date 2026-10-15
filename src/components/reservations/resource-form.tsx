"use client";

import { useEffect, useState } from "react";
import type { Resource } from "@/types/resource";

type ResourceFormProps = {
  resources: Resource[];
  selectedResourceId: string;
};

type AvailabilityResult = {
  available: boolean;
  message: string;
};
function getTodayLocalDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function ResourceForm({
  resources,
  selectedResourceId,
}: ResourceFormProps) {
  const [selectedId, setSelectedId] = useState(selectedResourceId);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityResult | null>(
    null,
  );
  const [success, setSuccess] = useState("");

  useEffect(() => {
    setSelectedId(selectedResourceId);
  }, [selectedResourceId]);

  const selectedResourceExists = resources.some(
    (resource) => resource.id === selectedId,
  );

  const canCheckAvailability =
    selectedResourceExists &&
    Boolean(date && startTime && endTime) &&
    startTime < endTime;

  function resetAvailability() {
    setAvailability(null);
    setError("");
    setSuccess("");
  }

  async function handleCheckAvailability() {
    setError("");
    setSuccess("");
    setAvailability(null);

    if (!selectedResourceExists) {
      setError("Please select an active resource.");
      return;
    }

    if (!date || !startTime || !endTime) {
      setError("Please select a date, start time, and end time.");
      return;
    }
    if (date < getTodayLocalDate()) {
      setError("Reservation date cannot be in the past.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    setIsCheckingAvailability(true);

    try {
      const params = new URLSearchParams({
        resourceId: selectedId,
        date,
        startTime,
        endTime,
      });

      const response = await fetch(
        `/api/reservations/availability?${params.toString()}`,
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to check availability.");
      }

      setAvailability({
        available: result.available,
        message: result.message,
      });
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsCheckingAvailability(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedResourceExists) {
      setError("Please select an active resource.");
      return;
    }
    if (date < getTodayLocalDate()) {
      setError("Reservation date cannot be in the past.");
      setAvailability(null);
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (!availability?.available) {
      setError("Please check availability before creating a reservation.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resourceId: selectedId,
          date,
          startTime,
          endTime,
          purpose,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setAvailability(null);
        throw new Error(result.message || "Unable to create the reservation.");
      }

      setSuccess("Reservation created successfully!");
      setDate("");
      setStartTime("");
      setEndTime("");
      setPurpose("");
      setAvailability(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
      <div>
        <label
          htmlFor="resourceId"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Select resource
        </label>

        <select
          id="resourceId"
          name="resourceId"
          value={selectedId}
          onChange={(event) => {
            setSelectedId(event.target.value);
            resetAvailability();
          }}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        >
          <option value="" disabled>
            Choose a resource
          </option>

          {resources.map((resource) => (
            <option key={resource.id} value={resource.id}>
              {resource.name} — {resource.location || "Location unspecified"}
            </option>
          ))}
        </select>

        {selectedId && !selectedResourceExists && (
          <p className="mt-2 text-sm text-amber-700">
            This resource is unavailable. Please choose an active resource.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="date"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Reservation date
        </label>

        <input
          id="date"
          name="date"
          type="date"
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            resetAvailability();
          }}
          min={getTodayLocalDate()}
          required
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="startTime"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Start time
          </label>

          <input
            id="startTime"
            name="startTime"
            type="time"
            value={startTime}
            onChange={(event) => {
              setStartTime(event.target.value);
              resetAvailability();
            }}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label
            htmlFor="endTime"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            End time
          </label>

          <input
            id="endTime"
            name="endTime"
            type="time"
            value={endTime}
            onChange={(event) => {
              setEndTime(event.target.value);
              resetAvailability();
            }}
            required
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleCheckAvailability}
        disabled={
          !canCheckAvailability || isCheckingAvailability || isSubmitting
        }
        className="w-full rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCheckingAvailability
          ? "Checking availability..."
          : "Check Availability"}
      </button>

      {availability && (
        <p
          role="status"
          className={`rounded-xl border p-3 text-sm ${
            availability.available
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-amber-200 bg-amber-50 text-amber-800"
          }`}
        >
          {availability.message}
        </p>
      )}

      <div>
        <label
          htmlFor="purpose"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Purpose
        </label>

        <textarea
          id="purpose"
          name="purpose"
          value={purpose}
          onChange={(event) => {
            setPurpose(event.target.value);
            setSuccess("");
          }}
          placeholder="e.g. Team meeting or client presentation"
          rows={3}
          maxLength={500}
          required
          className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800"
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={
          isSubmitting || isCheckingAvailability || !availability?.available
        }
        className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating reservation..." : "Create reservation"}
      </button>
    </form>
  );
}
