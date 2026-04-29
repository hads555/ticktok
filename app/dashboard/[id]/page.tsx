import { notFound } from "next/navigation";
import { timesheetStore } from "@/lib/timesheet-store";
import TimesheetDetail from "@/components/timesheet/TimesheetDetail";

interface Props {
  params: { id: string };
}

export default function TimesheetDetailPage({ params }: Props) {
  const timesheet = timesheetStore.getById(params.id);
  if (!timesheet) notFound();

  return <TimesheetDetail initialTimesheet={timesheet} />;
}
