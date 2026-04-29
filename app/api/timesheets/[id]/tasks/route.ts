import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { timesheetStore } from "@/lib/timesheet-store";
import { AddEntryFormValues } from "@/types";

// POST /api/timesheets/:id/tasks — add a task entry
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: AddEntryFormValues;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // Basic validation
  if (!body.project || !body.typeOfWork || !body.description || !body.hours) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 422 }
    );
  }

  if (body.hours <= 0 || body.hours > 24) {
    return NextResponse.json(
      { error: "Hours must be between 1 and 24" },
      { status: 422 }
    );
  }

  const updated = timesheetStore.addTask(params.id, body);
  if (!updated) {
    return NextResponse.json(
      { error: "Timesheet not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: updated }, { status: 201 });
}
