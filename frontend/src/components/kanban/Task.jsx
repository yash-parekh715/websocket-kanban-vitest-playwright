// src/components/kanban/Task.jsx
import { useState } from "react";
import { useDrag } from "react-dnd";
import { TaskDetails } from "./TaskDetails";
import {
  ClockIcon,
  PaperClipIcon,
  CheckIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export const Task = ({ task, accentColor = "bg-slate-600" }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task._id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityColors = {
    low: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    medium: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
    high: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-200",
      dot: "bg-rose-500",
    },
  };

  const categoryColors = {
    bug: {
      bg: "bg-rose-100",
      text: "text-rose-800",
      border: "border-rose-200",
    },
    feature: {
      bg: "bg-violet-100",
      text: "text-violet-800",
      border: "border-violet-200",
    },
    enhancement: {
      bg: "bg-sky-100",
      text: "text-sky-800",
      border: "border-sky-200",
    },
  };

  const hasAttachment =
    task.attachment && Object.keys(task.attachment).length > 0;
  const isImage = task.attachment?.type?.startsWith("image/");

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <div
        ref={drag}
        className={`group p-3 mb-3 bg-white rounded-lg shadow-sm hover:shadow border border-slate-200 cursor-grab transition-all ${
          isDragging ? "opacity-50 rotate-2 scale-95" : "opacity-100"
        } ${task.status === "done" ? "bg-emerald-50/50" : ""}`}
        onClick={() => setShowDetails(true)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Category Chip */}
        <div className="flex justify-between items-start mb-2">
          <div
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
              categoryColors[task.category].bg
            } ${categoryColors[task.category].text} ${
              categoryColors[task.category].border
            } border`}
          >
            {task.category === "bug" && (
              <svg
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {task.category === "feature" && (
              <svg
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {task.category === "enhancement" && (
              <svg
                className="h-3 w-3 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
          </div>

          {/* Priority Indicator */}
          <div className="flex items-center">
            <div
              className={`h-2 w-2 rounded-full ${
                priorityColors[task.priority].dot
              }`}
            ></div>
            <span
              className={`ml-1 text-xs ${priorityColors[task.priority].text}`}
            >
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-medium text-slate-800 text-sm">
            {task.status === "done" && (
              <span className="inline-flex items-center mr-1">
                <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
              </span>
            )}
            {task.title}
          </h3>

          {task.description && (
            <p className="text-slate-600 text-xs mt-1.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>

        {/* Image attachment if present */}
        {hasAttachment && isImage && (
          <div className="mt-2 -mx-3 -mb-3 rounded-b-lg overflow-hidden border-t border-slate-200 pt-2">
            <img
              src={task.attachment.dataUrl}
              alt="Attachment"
              className="w-full h-24 object-cover object-center rounded-b-lg"
            />
          </div>
        )}

        {/* Task footer */}
        <div
          className={`flex items-center justify-between mt-3 ${
            hasAttachment && isImage ? "absolute bottom-2 left-3 right-3" : ""
          }`}
        >
          <div className="flex items-center text-xs text-slate-500">
            <ClockIcon className="h-3.5 w-3.5 mr-1" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center space-x-2">
            {hasAttachment && !isImage && (
              <div className="flex items-center text-xs text-slate-500">
                <PaperClipIcon className="h-3.5 w-3.5 mr-1" />
              </div>
            )}
          </div>
        </div>

        {/* Hover effect - colored left border */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} rounded-l-lg transition-opacity ${
            isHovering ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>

      {showDetails && (
        <TaskDetails
          task={task}
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};
