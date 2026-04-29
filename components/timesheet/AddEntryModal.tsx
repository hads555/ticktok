"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { AddEntryFormValues } from "@/types";
import { PROJECTS, WORK_TYPES } from "@/lib/mock-data";
import { clamp } from "@/lib/utils";

interface AddEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (values: AddEntryFormValues) => Promise<void>;
  initialValues?: Partial<AddEntryFormValues>;
}

interface FormErrors {
  project?: string;
  typeOfWork?: string;
  description?: string;
  hours?: string;
}

const DEFAULT_VALUES: AddEntryFormValues = {
  project: "",
  typeOfWork: "",
  description: "",
  note: "",
  hours: 8,
  date: new Date().toISOString().split("T")[0],
};

export default function AddEntryModal({
  isOpen,
  onClose,
  onSave,
  initialValues,
}: AddEntryModalProps) {
  const [values, setValues] = useState<AddEntryFormValues>(DEFAULT_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const isEditing = !!initialValues?.project;

  // Sync form when modal opens or initialValues changes
  useEffect(() => {
    if (isOpen) {
      setValues({ ...DEFAULT_VALUES, ...initialValues });
      setErrors({});
    }
  }, [isOpen, initialValues]);

  // Trap focus; close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  function set<K extends keyof AddEntryFormValues>(
    key: K,
    value: AddEntryFormValues[K]
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!values.project) errs.project = "Please select a project.";
    if (!values.typeOfWork) errs.typeOfWork = "Please select a work type.";
    if (!values.description.trim())
      errs.description = "Task description is required.";
    if (!values.hours || values.hours <= 0 || values.hours > 24)
      errs.hours = "Hours must be between 1 and 24.";
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(values);
    } finally {
      setIsSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-[646px] max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 id="modal-title" className="text-base font-semibold text-gray-900">
            {isEditing ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <XIcon />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4">
          {/* Project */}
          <Field label="Select Project" required error={errors.project}>
            <select
              value={values.project}
              onChange={(e) => set("project", e.target.value)}
              aria-invalid={!!errors.project}
              className={selectClass(!!errors.project)}
            >
              <option value="">Project Name</option>
              {PROJECTS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>

          {/* Type of work */}
          <Field label="Type of Work" required error={errors.typeOfWork}>
            <select
              value={values.typeOfWork}
              onChange={(e) => set("typeOfWork", e.target.value)}
              aria-invalid={!!errors.typeOfWork}
              className={selectClass(!!errors.typeOfWork)}
            >
              <option value="">Bug fixes</option>
              {WORK_TYPES.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </Field>

          {/* Description */}
          <Field label="Task description" required error={errors.description}>
            <textarea
              value={values.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Write text here …"
              rows={4}
              aria-invalid={!!errors.description}
              className={inputClass(!!errors.description) + " resize-none"}
            />
          </Field>
          <label className="font-normal text-xs">A Note for extra Info</label>

          {/* Hours stepper */}
          <Field label="Hours" required error={errors.hours}>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => set("hours", clamp(values.hours - 1, 1, 24))}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-lg font-medium"
                aria-label="Decrease hours"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-medium text-gray-800">
                {values.hours}
              </span>
              <button
                type="button"
                onClick={() => set("hours", clamp(values.hours + 1, 1, 24))}
                className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 text-gray-600 hover:bg-gray-50 transition text-lg font-medium"
                aria-label="Increase hours"
              >
                +
              </button>
            </div>
          </Field>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md text-sm transition"
            >
              {isSaving ? "Saving…" : "Add entry"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-2.5 rounded-md text-sm transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Small helpers ───────────────────────────────────────────────────────────

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;
}

function selectClass(hasError: boolean) {
  return `w-full border rounded-md px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500 transition ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
