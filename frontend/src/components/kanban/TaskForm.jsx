// src/components/kanban/TaskForm.jsx
import { useState, useEffect } from "react";
import { useKanban } from "../../context/kanbanContext";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import { Dropzone } from "./Dropzone";
import { motion } from "framer-motion";
import {
  DocumentTextIcon,
  TagIcon,
  ArrowPathIcon,
  PaperClipIcon,
  XMarkIcon,
  CheckIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

export const TaskForm = ({ task, isOpen, onClose }) => {
  const { createTask, updateTask } = useKanban();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: { value: "todo", label: "To Do" },
    priority: { value: "medium", label: "Medium" },
    category: { value: "feature", label: "Feature" },
    attachment: null,
  });

  // Load task data if editing
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: {
          value: task.status,
          label: {
            todo: "To Do",
            inProgress: "In Progress",
            done: "Done",
          }[task.status],
        },
        priority: {
          value: task.priority,
          label: task.priority.charAt(0).toUpperCase() + task.priority.slice(1),
        },
        category: {
          value: task.category,
          label: task.category.charAt(0).toUpperCase() + task.category.slice(1),
        },
        attachment: task.attachment,
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const taskData = {
      title: formData.title,
      description: formData.description,
      status: formData.status.value,
      priority: formData.priority.value,
      category: formData.category.value,
      attachment: formData.attachment,
    };

    if (task) {
      updateTask({ id: task._id, ...taskData });
    } else {
      createTask(taskData);
    }

    onClose();
  };

  // Dropdown options
  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "inProgress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const categoryOptions = [
    { value: "bug", label: "Bug" },
    { value: "feature", label: "Feature" },
    { value: "enhancement", label: "Enhancement" },
  ];

  // Color mapping based on priority
  const priorityColors = {
    low: "border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500",
    medium: "border-amber-200 focus:border-amber-500 focus:ring-amber-500",
    high: "border-rose-200 focus:border-rose-500 focus:ring-rose-500",
  };

  // Status icons and colors
  const statusIcons = {
    todo: <TagIcon className="h-5 w-5 text-slate-500" />,
    inProgress: (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <ArrowPathIcon className="h-5 w-5 text-blue-500" />
      </motion.div>
    ),
    done: <CheckIcon className="h-5 w-5 text-green-500" />,
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? "Edit Task" : "Create New Task"}
      size="lg"
    >
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        variants={formVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <label className="text-sm font-medium text-slate-700">Title</label>
          </div>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Task title"
          />
        </motion.div>

        {/* Description */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <PencilSquareIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border border-slate-300 rounded-lg shadow-sm py-2.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Describe the task..."
          />
        </motion.div>

        {/* Status and Priority in a 2-column grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Status */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-2">
              <ArrowPathIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <label className="text-sm font-medium text-slate-700">
                Status
              </label>
            </div>
            <div className="mt-1">
              <Select
                options={statusOptions}
                value={formData.status}
                onChange={(option) =>
                  setFormData((prev) => ({ ...prev, status: option }))
                }
                placeholder="Select status"
                className="shadow-sm"
              />
            </div>
            <div className="mt-2 flex space-x-4 justify-center">
              {statusOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, status: option }))
                  }
                  className={`flex items-center p-2 rounded-md cursor-pointer transition-all
                    ${
                      formData.status.value === option.value
                        ? `bg-${
                            option.value === "todo"
                              ? "slate"
                              : option.value === "inProgress"
                              ? "blue"
                              : "green"
                          }-100 border-${
                            option.value === "todo"
                              ? "slate"
                              : option.value === "inProgress"
                              ? "blue"
                              : "green"
                          }-300 border`
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                >
                  <div className="mr-1.5">
                    {option.value === "todo" && (
                      <TagIcon className="h-4 w-4 text-slate-500" />
                    )}
                    {option.value === "inProgress" && (
                      <ArrowPathIcon className="h-4 w-4 text-blue-500" />
                    )}
                    {option.value === "done" && (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center mb-2">
              <TagIcon className="h-5 w-5 text-indigo-500 mr-2" />
              <label className="text-sm font-medium text-slate-700">
                Priority
              </label>
            </div>
            <div className="mt-1">
              <Select
                options={priorityOptions}
                value={formData.priority}
                onChange={(option) =>
                  setFormData((prev) => ({ ...prev, priority: option }))
                }
                placeholder="Select priority"
                className="shadow-sm"
              />
            </div>
            <div className="mt-2 flex space-x-4 justify-center">
              {priorityOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, priority: option }))
                  }
                  className={`flex items-center p-2 rounded-md cursor-pointer transition-all
                    ${
                      formData.priority.value === option.value
                        ? `bg-${
                            option.value === "low"
                              ? "emerald"
                              : option.value === "medium"
                              ? "amber"
                              : "rose"
                          }-100 border-${
                            option.value === "low"
                              ? "emerald"
                              : option.value === "medium"
                              ? "amber"
                              : "rose"
                          }-300 border`
                        : "hover:bg-slate-50 border border-transparent"
                    }`}
                >
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-1.5 bg-${
                      option.value === "low"
                        ? "emerald"
                        : option.value === "medium"
                        ? "amber"
                        : "rose"
                    }-500`}
                  ></span>
                  <span className="text-xs font-medium">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <TagIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <label className="text-sm font-medium text-slate-700">
              Category
            </label>
          </div>
          <div className="mt-1">
            <Select
              options={categoryOptions}
              value={formData.category}
              onChange={(option) =>
                setFormData((prev) => ({ ...prev, category: option }))
              }
              placeholder="Select category"
              className="shadow-sm"
            />
          </div>
          <div className="mt-2 flex space-x-2 flex-wrap">
            {categoryOptions.map((option) => (
              <div
                key={option.value}
                onClick={() =>
                  setFormData((prev) => ({ ...prev, category: option }))
                }
                className={`flex items-center p-2 m-1 rounded-md cursor-pointer transition-all
                  ${
                    formData.category.value === option.value
                      ? "bg-indigo-100 border-indigo-300 border"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
              >
                <span className="text-xs font-medium">{option.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Attachment */}
        <motion.div
          variants={itemVariants}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
        >
          <div className="flex items-center mb-2">
            <PaperClipIcon className="h-5 w-5 text-indigo-500 mr-2" />
            <label className="text-sm font-medium text-slate-700">
              Attachment
            </label>
          </div>
          <Dropzone
            onFileUpload={(file) =>
              setFormData((prev) => ({ ...prev, attachment: file }))
            }
            attachment={formData.attachment}
          />
          {formData.attachment && (
            <div className="mt-2 text-xs text-slate-500 flex items-center">
              <PaperClipIcon className="h-3 w-3 mr-1" />
              <span>{formData.attachment.name}</span>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex justify-end space-x-3 pt-4"
        >
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex items-center"
          >
            <XMarkIcon className="h-4 w-4 mr-1.5" />
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex items-center bg-indigo-600 hover:bg-indigo-700"
          >
            {task ? (
              <>
                <CheckIcon className="h-4 w-4 mr-1.5" />
                Update Task
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-4 w-4 mr-1.5" />
                Create Task
              </>
            )}
          </Button>
        </motion.div>
      </motion.form>
    </Modal>
  );
};
