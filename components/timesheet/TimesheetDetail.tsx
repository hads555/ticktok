"use client";

import { useState, useRef, useEffect } from "react";
import { TimesheetEntry, Task, AddEntryFormValues } from "@/types";
import AddEntryModal from "./AddEntryModal";
import TaskRow from "./TaskRow";

interface Props {
  initialTimesheet: TimesheetEntry;
}

function groupTasksByDate(tasks: Task[]): Record<string, Task[]> {
  return tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const key = task.date;
    if (!acc[key]) acc[key] = [];
    acc[key].push(task);
    return acc;
  }, {});
}

function formatDayLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Three-dot dropdown menu for each task row */
function TaskMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center w-7 h-7 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Task options"
      >
        {/* Three dots icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <circle cx="3" cy="8" r="1.3" />
          <circle cx="8" cy="8" r="1.3" />
          <circle cx="13" cy="8" r="1.3" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-50 w-28 bg-white border border-gray-200 rounded-lg shadow-lg py-1 text-sm">
          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="w-full text-left px-4 py-1.5 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full text-left px-4 py-1.5 text-red-500 hover:bg-gray-50 transition-colors"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function TimesheetDetail({ initialTimesheet }: Props) {
  const [timesheet, setTimesheet] = useState<TimesheetEntry>(initialTimesheet);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const TARGET_HOURS = 40;
  const pct = Math.min(100, Math.round((timesheet.totalHours / TARGET_HOURS) * 100));

  function getWeekDates(): string[] {
    const dates: string[] = [];
    const start = new Date(timesheet.startDate + "T00:00:00");
    const end = new Date(timesheet.endDate + "T00:00:00");
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  }

  const weekDates = getWeekDates();
  const grouped = groupTasksByDate(timesheet.tasks);

  function openAddModal(date: string) {
    setSelectedDate(date);
    setEditingTask(null);
    setIsModalOpen(true);
  }

  function openEditModal(task: Task) {
    setSelectedDate(task.date);
    setEditingTask(task);
    setIsModalOpen(true);
  }

  async function handleSaveTask(values: AddEntryFormValues) {
    setError(null);
    try {
      if (editingTask) {
        const res = await fetch(
          `/api/timesheets/${timesheet.id}/tasks/${editingTask.id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        if (!res.ok) throw new Error("Failed to update entry.");
        const json = await res.json();
        setTimesheet(json.data);
      } else {
        const res = await fetch(`/api/timesheets/${timesheet.id}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...values, date: selectedDate }),
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.error ?? "Failed to add entry.");
        }
        const json = await res.json();
        setTimesheet(json.data);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  }

  async function handleDeleteTask(taskId: string) {
    setError(null);
    try {
      const res = await fetch(
        `/api/timesheets/${timesheet.id}/tasks/${taskId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete entry.");
      const json = await res.json();
      setTimesheet(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

        {/* ── Header: title left, progress bar + % right, all on one row ── */}
        <div className="flex items-center justify-between gap-6 mb-1">
          <h1 className="text-xl font-semibold text-gray-900 whitespace-nowrap">
            This week&apos;s timesheet
          </h1>

          {/* Progress bar section */}
          <div className="flex items-center gap-3 min-w-[280px]">
            {/* Bar with floating tooltip above the fill end-point */}
            <div className="relative flex-1 pt-6">
              {/* Floating tooltip pinned to end of fill */}
              <div
                className="absolute top-0 -translate-x-1/2 z-10"
                style={{ left: `${pct}%` }}
              >
                <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-0.5 text-xs font-medium text-gray-700 shadow-sm whitespace-nowrap">
                  {timesheet.totalHours}/{TARGET_HOURS} hrs
                </span>
              </div>

              {/* Track */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-orange-400 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Percentage label */}
            <span className="text-xs text-gray-400 whitespace-nowrap w-9 text-right shrink-0">
              {pct}%
            </span>
          </div>
        </div>

        {/* Date range subtitle */}
        <p className="text-sm text-gray-400 mb-6">{timesheet.dateRange}</p>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {error}
          </div>
        )}

        {/* ── Day sections ── */}
        <div className="space-y-6">
          {weekDates.map((date) => {
            const dayTasks = grouped[date] ?? [];
            return (
              <div key={date} className="flex justify-between">
                {/* Day label */}
                <h2 className="text-sm font-semibold text-gray-800 mb-2">
                  {formatDayLabel(date)}
                </h2>

                {/* Task rows */}
                <div className="space-y-px w-[94%]">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="mb-[10px] flex items-center justify-between px-4 py-2.5 bg-white border border-gray-100 rounded-lg hover:bg-primary-700 transition-colors group"
                    >
                      {/* Task description */}
                      <span className="text-sm text-gray-700 flex-1 truncate pr-4">
                        {task.description ?? task.typeOfWork}
                      </span>

                      {/* Right side: hrs + badge + menu */}
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm text-gray-500">
                          {task.hours} hrs
                        </span>

                        {/* Project name badge */}
                        <span className="inline-flex items-center rounded border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 whitespace-nowrap">
                          {task.project}
                        </span>

                        {/* Three-dot menu */}
                        <TaskMenu
                          onEdit={() => openEditModal(task)}
                          onDelete={() => handleDeleteTask(task.id)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Add new task button */}
                  <button
                    onClick={() => openAddModal(date)}
                    className="w-full border border-dashed border-blue-300 hover:border-blue-400 bg-white hover:bg-blue-50/30 rounded-lg py-2.5 text-sm text-blue-400 hover:bg-primary-700 transition-all flex items-center justify-center gap-1.5 mt-1"
                  >
                    <span className="text-base leading-none font-light">+</span>
                    Add new task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AddEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialValues={
          editingTask
            ? {
                project: editingTask.project,
                typeOfWork: editingTask.typeOfWork,
                description: editingTask.description,
                note: editingTask.note,
                hours: editingTask.hours,
                date: editingTask.date,
              }
            : undefined
        }
      />
    </>
  );
}