"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type CancelReservationButtonProps = {
  reservationId: string;
};

export function CancelReservationButton({
  reservationId,
}: CancelReservationButtonProps) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");

  async function handleCancel() {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation?",
    );

    if (!confirmed) return;

    setIsCancelling(true);
    setError("");

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to cancel the reservation.");
      }

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.",
      );
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleCancel}
        disabled={isCancelling}
        className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isCancelling ? "Cancelling..." : "Cancel"}
      </button>

      {error && (
        <p role="alert" className="max-w-40 text-xs text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
