// ─── Timesheet types ────────────────────────────────────────────────────────

export type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  dateRange: string; // e.g. "1 - 5 January, 2024"
  startDate: string; // ISO date string
  endDate: string;
  status: TimesheetStatus;
  tasks: Task[];
  totalHours: number;
}

export interface Task {
  id: string;
  date: string; // ISO date string
  project: string;
  typeOfWork: string;
  description: string;
  note?: string;
  hours: number;
}

// ─── Form types ─────────────────────────────────────────────────────────────

export interface AddEntryFormValues {
  project: string;
  typeOfWork: string;
  description: string;
  note?: string;
  hours: number;
  date: string;
}

// ─── API response types ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

// ─── Filter / query types ────────────────────────────────────────────────────

export interface TimesheetFilters {
  status?: TimesheetStatus | "ALL";
  dateRange?: string;
  page?: number;
  perPage?: number;
}
