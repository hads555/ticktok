import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { timesheetStore } from "@/lib/timesheet-store";
import { AddEntryFormValues } from "@/types";

// PATCH /api/timesheets/:id/tasks/:taskId
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: Partial<AddEntryFormValues> = await req.json();
  const updated = timesheetStore.updateTask(params.id, params.taskId, body as AddEntryFormValues);

  if (!updated) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}

// DELETE /api/timesheets/:id/tasks/:taskId
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const updated = timesheetStore.deleteTask(params.id, params.taskId);
  if (!updated) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ data: updated });
}
