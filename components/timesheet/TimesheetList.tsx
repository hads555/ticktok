"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TimesheetEntry, TimesheetStatus, PaginatedResponse } from "@/types";
import Pagination from "./Pagination";

const STATUS_OPTIONS: { label: string; value: TimesheetStatus | "ALL" }[] = [
  { label: "Status", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Incomplete", value: "INCOMPLETE" },
  { label: "Missing", value: "MISSING" },
];

const DATE_RANGE_OPTIONS = [
  { label: "Date Range", value: "ALL" },
  { label: "This Week", value: "THIS_WEEK" },
  { label: "Last Week", value: "LAST_WEEK" },
  { label: "This Month", value: "THIS_MONTH" },
  { label: "Last Month", value: "LAST_MONTH" },
];

const PER_PAGE_OPTIONS = [5, 10, 20];

export default function TimesheetList() {
  const router = useRouter();
  const [data, setData] = useState<PaginatedResponse<TimesheetEntry> | null>(null);
  const [status, setStatus] = useState<TimesheetStatus | "ALL">("ALL");
  const [dateRange, setDateRange] = useState("ALL");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTimesheets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        perPage: String(perPage),
        status,
        dateRange,
      });
      const res = await fetch(`/api/timesheets?${params}`);
      if (!res.ok) throw new Error("Failed to load timesheets.");
      const json = await res.json();
      setData(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, status, dateRange]);

  useEffect(() => {
    fetchTimesheets();
  }, [fetchTimesheets]);

  function handleStatusChange(value: TimesheetStatus | "ALL") {
    setStatus(value);
    setPage(1);
  }

  function handleDateRangeChange(value: string) {
    setDateRange(value);
    setPage(1);
  }

  function handleAction(ts: TimesheetEntry) {
    router.push(`/dashboard/${ts.id}`);
  }

  /** Returns the pill styles matching the screenshot */
  function getStatusBadge(tsStatus: TimesheetStatus) {
    switch (tsStatus) {
      case "COMPLETED":
        return {
          className: "bg-emerald-100 text-emerald-700",
          label: "COMPLETED",
        };
      case "INCOMPLETE":
        return {
          className: "bg-amber-100 text-amber-700",
          label: "INCOMPLETE",
        };
      case "MISSING":
      default:
        return {
          className: "bg-rose-100 text-rose-500",
          label: "MISSING",
        };
    }
  }

  /** Returns the action link text + color matching the screenshot */
  function getActionButton(ts: TimesheetEntry) {
    switch (ts.status) {
      case "COMPLETED":
        return { label: "View", className: "text-blue-500 hover:text-blue-700" };
      case "INCOMPLETE":
        return { label: "Update", className: "text-blue-500 hover:text-blue-700" };
      case "MISSING":
      default:
        return { label: "Create", className: "text-blue-500 hover:text-blue-700" };
    }
  }

  const SortIcon = () => (
    <svg
      className="w-3.5 h-3.5 inline ml-1 text-gray-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );

  const ChevronDown = () => (
    <svg
      className="w-4 h-4 text-gray-500 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Your Timesheets
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {/* Date Range dropdown */}
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              aria-label="Filter by date range"
              className="appearance-none border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {DATE_RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) =>
                handleStatusChange(e.target.value as TimesheetStatus | "ALL")
              }
              aria-label="Filter by status"
              className="appearance-none border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm" aria-label="Timesheets table">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/60">
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px] bg-gray-100 border-b border-gray-300">
                Week # <SortIcon />
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[260px]">
                Date <SortIcon />
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[150px]">
                Status <SortIcon />
              </th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center text-gray-400">
                  No timesheets found.
                </td>
              </tr>
            ) : (
              data?.items.map((ts) => {
                const badge = getStatusBadge(ts.status);
                const action = getActionButton(ts);
                return (
                  <tr
                    key={ts.id}
                    className="hover:bg-gray-50/70 transition-colors"
                  >
                    {/* Week # */}
                    <td className="px-6 py-4 text-gray-700 font-medium bg-gray-100 border-b border-gray-200">
                      {ts.weekNumber}
                    </td>

                    {/* Date range */}
                    <td className="px-6 py-4 text-gray-600">
                      {ts.dateRange}
                    </td>

                    {/* Status badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleAction(ts)}
                        className={`text-sm font-medium ${action.className} transition-colors`}
                      >
                        {action.label}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: per-page + pagination */}
      {data && data.totalPages > 0 && (
        <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100">
          {/* Per page selector */}
          <div className="relative flex items-center gap-2 text-sm text-gray-600">
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              aria-label="Rows per page"
              className="appearance-none border border-gray-300 rounded-md pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {PER_PAGE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} per page
                </option>
              ))}
            </select>
            <ChevronDown />
          </div>

          <Pagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}