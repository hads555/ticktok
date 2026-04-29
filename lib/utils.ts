import { TimesheetStatus } from "@/types";

/**
 * Returns Tailwind classes for the status badge.
 */
export function getStatusStyles(status: TimesheetStatus): {
  bg: string;
  text: string;
  label: string;
} {
  const map: Record<
    TimesheetStatus,
    { bg: string; text: string; label: string }
  > = {
    COMPLETED: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Completed",
    },
    INCOMPLETE: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Incomplete",
    },
    MISSING: { bg: "bg-red-100", text: "text-red-600", label: "Missing" },
  };
  return map[status];
}

/**
 * Returns the action label for a given timesheet status.
 */
export function getActionLabel(status: TimesheetStatus): string {
  if (status === "COMPLETED") return "View";
  if (status === "INCOMPLETE") return "Update";
  return "Create";
}

/**
 * Clamps a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Formats a date string to a human-readable form.
 */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
