import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { timesheetStore } from "@/lib/timesheet-store";

// GET /api/timesheets/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ts = timesheetStore.getById(params.id);
  if (!ts) {
    return NextResponse.json(
      { error: "Timesheet not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: ts });
}

// PATCH /api/timesheets/:id — update status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const updated = timesheetStore.update(params.id, body);

  if (!updated) {
    return NextResponse.json(
      { error: "Timesheet not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: updated });
}
