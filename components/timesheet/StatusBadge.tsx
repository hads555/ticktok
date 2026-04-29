import { TimesheetStatus } from "@/types";
import { getStatusStyles } from "@/lib/utils";

interface StatusBadgeProps {
  status: TimesheetStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const { bg, text, label } = getStatusStyles(status);
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wide ${bg} ${text}`}
    >
      {label}
    </span>
  );
}
