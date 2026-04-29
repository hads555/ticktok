import { timesheetStore } from "@/lib/timesheet-store";

describe("timesheetStore", () => {
  beforeEach(() => {
    timesheetStore.reset();
  });

  describe("getAll", () => {
    it("returns a non-empty array of timesheets", () => {
      const items = timesheetStore.getAll();
      expect(items.length).toBeGreaterThan(0);
    });
  });

  describe("getById", () => {
    it("returns the correct timesheet by id", () => {
      const all = timesheetStore.getAll();
      const first = all[0];
      expect(timesheetStore.getById(first.id)).toEqual(first);
    });

    it("returns undefined for an unknown id", () => {
      expect(timesheetStore.getById("non-existent-id")).toBeUndefined();
    });
  });

  describe("update", () => {
    it("updates a timesheet's status", () => {
      const id = timesheetStore.getAll()[0].id;
      const updated = timesheetStore.update(id, { status: "MISSING" });
      expect(updated?.status).toBe("MISSING");
    });

    it("returns null for an unknown id", () => {
      expect(timesheetStore.update("bad-id", { status: "MISSING" })).toBeNull();
    });
  });

  describe("addTask", () => {
    it("adds a task and recalculates totalHours", () => {
      const ts = timesheetStore.getAll().find((t) => t.id === "ts-5")!; // MISSING, 0 tasks
      const before = ts.totalHours;

      const result = timesheetStore.addTask(ts.id, {
        project: "Mobile App",
        typeOfWork: "Development",
        description: "Feature work",
        hours: 6,
        date: "2024-01-28",
      });

      expect(result).not.toBeNull();
      expect(result!.tasks.length).toBe(1);
      expect(result!.totalHours).toBe(before + 6);
    });

    it("returns null for unknown timesheet id", () => {
      expect(
        timesheetStore.addTask("bad-id", {
          project: "X",
          typeOfWork: "Y",
          description: "Z",
          hours: 1,
          date: "2024-01-01",
        })
      ).toBeNull();
    });
  });

  describe("deleteTask", () => {
    it("removes a task and updates totalHours", () => {
      // ts-1 has tasks in seed data
      const ts = timesheetStore.getById("ts-1")!;
      const taskId = ts.tasks[0].id;
      const hoursBefore = ts.totalHours;
      const taskHours = ts.tasks[0].hours;

      const result = timesheetStore.deleteTask("ts-1", taskId);
      expect(result!.tasks.find((t) => t.id === taskId)).toBeUndefined();
      expect(result!.totalHours).toBe(hoursBefore - taskHours);
    });

    it("returns null for unknown timesheet id", () => {
      expect(timesheetStore.deleteTask("bad-id", "task-1")).toBeNull();
    });
  });

  describe("reset", () => {
    it("restores the store to seed data after mutations", () => {
      const id = timesheetStore.getAll()[0].id;
      timesheetStore.update(id, { status: "MISSING" });
      timesheetStore.reset();
      // After reset the first item should have original status
      expect(timesheetStore.getAll()[0].status).toBe("COMPLETED");
    });
  });
});
