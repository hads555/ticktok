"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/types";

interface TaskRowProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-2.5 bg-white border border-gray-100 rounded-lg hover:border-gray-200 transition group">
      <span className="flex-1 text-sm text-gray-800 truncate">
        {task.description}
      </span>
      <span className="text-sm text-gray-500 shrink-0">{task.hours} hrs</span>
      <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded shrink-0">
        {task.project}
      </span>

      {/* Action menu */}
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Task actions"
          className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
        >
          <DotsIcon />
        </button>
        {menuOpen && (
          <div
            role="menu"
            className="absolute right-0 top-7 z-20 bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden text-sm min-w-[100px]"
          >
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onEdit();
              }}
              className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
            >
              Edit
            </button>
            <button
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onDelete();
              }}
              className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DotsIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}
