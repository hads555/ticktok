import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/components/timesheet/Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} totalPages={1} onPageChange={jest.fn()} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls onPageChange when a page button is clicked", () => {
    const onChange = jest.fn();
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={onChange} />
    );
    fireEvent.click(screen.getByText("2"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('disables "Previous" button on first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={jest.fn()} />
    );
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
  });

  it('disables "Next" button on last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={jest.fn()} />
    );
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("marks the current page button with aria-current=page", () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={jest.fn()} />
    );
    const btn = screen.getByText("3");
    expect(btn).toHaveAttribute("aria-current", "page");
  });
});
