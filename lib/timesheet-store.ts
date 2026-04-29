/**
 * In-memory timesheet store.
 * Acts as a lightweight mock database for demo purposes.
 * In production, replace with a real DB (Prisma, Drizzle, etc.).
 */
import { TimesheetEntry, Task, AddEntryFormValues } from "@/types";
import { MOCK_TIMESHEETS } from "./mock-data";

// Simple UUID using built-in crypto (Node 18+)
function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Clone seed data so mutations don't affect imports
let store: TimesheetEntry[] = JSON.parse(JSON.stringify(MOCK_TIMESHEETS));

export const timesheetStore = {
  getAll(): TimesheetEntry[] {
    return store;
  },

  getById(id: string): TimesheetEntry | undefined {
    return store.find((ts) => ts.id === id);
  },

  create(entry: Omit<TimesheetEntry, "id">): TimesheetEntry {
    const newEntry: TimesheetEntry = { ...entry, id: `ts-${generateId()}` };
    store.push(newEntry);
    return newEntry;
  },

  update(id: string, patch: Partial<TimesheetEntry>): TimesheetEntry | null {
    const idx = store.findIndex((ts) => ts.id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...patch };
    return store[idx];
  },

  delete(id: string): boolean {
    const before = store.length;
    store = store.filter((ts) => ts.id !== id);
    return store.length < before;
  },

  addTask(timesheetId: string, values: AddEntryFormValues): TimesheetEntry | null {
    const ts = store.find((t) => t.id === timesheetId);
    if (!ts) return null;

    const task: Task = {
      id: `task-${generateId()}`,
      date: values.date,
      project: values.project,
      typeOfWork: values.typeOfWork,
      description: values.description,
      note: values.note,
      hours: values.hours,
    };

    ts.tasks.push(task);
    ts.totalHours = ts.tasks.reduce((sum, t) => sum + t.hours, 0);

    return ts;
  },

  updateTask(
    timesheetId: string,
    taskId: string,
    values: AddEntryFormValues
  ): TimesheetEntry | null {
    const ts = store.find((t) => t.id === timesheetId);
    if (!ts) return null;

    const taskIdx = ts.tasks.findIndex((t) => t.id === taskId);
    if (taskIdx === -1) return null;

    ts.tasks[taskIdx] = { ...ts.tasks[taskIdx], ...values };
    ts.totalHours = ts.tasks.reduce((sum, t) => sum + t.hours, 0);
    return ts;
  },

  deleteTask(timesheetId: string, taskId: string): TimesheetEntry | null {
    const ts = store.find((t) => t.id === timesheetId);
    if (!ts) return null;

    ts.tasks = ts.tasks.filter((t) => t.id !== taskId);
    ts.totalHours = ts.tasks.reduce((sum, t) => sum + t.hours, 0);
    return ts;
  },

  /** Reset store to seed data (useful for testing) */
  reset(): void {
    store = JSON.parse(JSON.stringify(MOCK_TIMESHEETS));
  },
};
