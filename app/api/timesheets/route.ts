import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { timesheetStore } from "@/lib/timesheet-store";
import { TimesheetFilters, TimesheetStatus } from "@/types";

// GET /api/timesheets?page=1&perPage=5&status=ALL
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("perPage") ?? "5");
  const status = (searchParams.get("status") ?? "ALL") as
    | TimesheetStatus
    | "ALL";

  let items = timesheetStore.getAll();

  // Filter by status
  if (status && status !== "ALL") {
    items = items.filter((ts) => ts.status === status);
  }

  const total = items.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const paginated = items.slice(start, start + perPage);

  return NextResponse.json({
    data: {
      items: paginated,
      total,
      page,
      perPage,
      totalPages,
    },
  });
}
