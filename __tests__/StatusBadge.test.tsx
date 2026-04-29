import { render, screen } from "@testing-library/react";
import StatusBadge from "@/components/timesheet/StatusBadge";

describe("StatusBadge", () => {
  it('renders "Completed" label for COMPLETED status', () => {
    render(<StatusBadge status="COMPLETED" />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it('renders "Incomplete" label for INCOMPLETE status', () => {
    render(<StatusBadge status="INCOMPLETE" />);
    expect(screen.getByText("Incomplete")).toBeInTheDocument();
  });

  it('renders "Missing" label for MISSING status', () => {
    render(<StatusBadge status="MISSING" />);
    expect(screen.getByText("Missing")).toBeInTheDocument();
  });

  it("applies green styles for COMPLETED", () => {
    const { container } = render(<StatusBadge status="COMPLETED" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-green-100");
    expect(badge.className).toContain("text-green-700");
  });

  it("applies yellow styles for INCOMPLETE", () => {
    const { container } = render(<StatusBadge status="INCOMPLETE" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-yellow-100");
  });

  it("applies red styles for MISSING", () => {
    const { container } = render(<StatusBadge status="MISSING" />);
    const badge = container.firstChild as HTMLElement;
    expect(badge.className).toContain("bg-red-100");
  });
});
