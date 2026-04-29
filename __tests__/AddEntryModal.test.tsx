import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddEntryModal from "@/components/timesheet/AddEntryModal";

const defaultProps = {
  isOpen: true,
  onClose: jest.fn(),
  onSave: jest.fn().mockResolvedValue(undefined),
};

describe("AddEntryModal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    render(<AddEntryModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the modal when isOpen is true", () => {
    render(<AddEntryModal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Add New Entry")).toBeInTheDocument();
  });

  it('shows "Edit Entry" title when initialValues are provided', () => {
    render(
      <AddEntryModal
        {...defaultProps}
        initialValues={{
          project: "Website Redesign",
          typeOfWork: "Development",
          description: "Homepage",
          hours: 4,
          date: "2024-01-01",
        }}
      />
    );
    expect(screen.getByText("Edit Entry")).toBeInTheDocument();
  });

  it("shows validation errors when submitted with empty fields", async () => {
    render(<AddEntryModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));
    await waitFor(() => {
      expect(screen.getByText("Please select a project.")).toBeInTheDocument();
      expect(screen.getByText("Please select a work type.")).toBeInTheDocument();
      expect(
        screen.getByText("Task description is required.")
      ).toBeInTheDocument();
    });
  });

  it("calls onClose when Cancel is clicked", () => {
    render(<AddEntryModal {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape key is pressed", () => {
    render(<AddEntryModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("increments and decrements hours with stepper buttons", async () => {
    render(<AddEntryModal {...defaultProps} />);
    const incBtn = screen.getByLabelText("Increase hours");
    const decBtn = screen.getByLabelText("Decrease hours");

    // Default hours = 8
    expect(screen.getByText("8")).toBeInTheDocument();

    fireEvent.click(incBtn);
    expect(screen.getByText("9")).toBeInTheDocument();

    fireEvent.click(decBtn);
    fireEvent.click(decBtn);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("calls onSave with correct values on valid submission", async () => {
    const user = userEvent.setup();
    render(<AddEntryModal {...defaultProps} />);

    // Select project
    await user.selectOptions(
      screen.getByDisplayValue("Project Name"),
      "Website Redesign"
    );

    // Select type of work
    await user.selectOptions(
      screen.getByDisplayValue("Bug fixes"),
      "Development"
    );

    // Fill description
    await user.type(
      screen.getByPlaceholderText("Write text here …"),
      "Built the homepage"
    );

    fireEvent.click(screen.getByRole("button", { name: /add entry/i }));

    await waitFor(() => {
      expect(defaultProps.onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          project: "Website Redesign",
          typeOfWork: "Development",
          description: "Built the homepage",
          hours: 8,
        })
      );
    });
  });
});
