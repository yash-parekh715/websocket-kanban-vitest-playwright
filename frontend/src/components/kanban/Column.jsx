// src/components/kanban/Column.jsx
import { useState } from "react";
import { useDrop } from "react-dnd";
import { Task } from "./Task";
import { useKanban } from "../../context/kanbanContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export const Column = ({
  title,
  icon,
  status,
  tasks,
  color = "bg-slate-50",
  borderColor = "border-slate-200",
  headingColor = "text-slate-700",
  accentColor = "bg-slate-600",
}) => {
  const { moveTask, createTask } = useKanban();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    hover: () => setIsDraggingOver(true),
    drop: (item) => {
      if (item.status !== status) {
        moveTask(item.id, item.status, status);
      }
      setIsDraggingOver(false);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      createTask({
        title: newTaskTitle,
        status,
        priority: "medium",
        category: "feature",
      });
      setNewTaskTitle("");
      setIsAddingTask(false);
    }
  };

  return (
    <div
      ref={drop}
      className={`rounded-xl ${color} border ${borderColor} ${
        isOver
          ? "ring-2 ring-indigo-400 shadow-lg transform scale-[1.02] transition-all z-10"
          : "shadow-sm transform scale-100 transition-transform"
      }`}
    >
      <div className="p-4 border-b border-slate-200 flex justify-between items-center">
        <div className="flex items-center">
          {icon}
          <h3 className={`font-medium ${headingColor} ml-2`}>{title}</h3>
          <div className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-white text-slate-600 border border-slate-200">
            {tasks.length}
          </div>
        </div>
      </div>

      <div
        className={`p-3 max-h-[calc(100vh-220px)] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent ${
          isDraggingOver ? "bg-indigo-50/50" : ""
        }`}
      >
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{
                duration: 0.2,
                delay: index * 0.05,
                ease: "easeOut",
              }}
            >
              <Task task={task} accentColor={accentColor} />
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isAddingTask ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2"
            >
              <form
                onSubmit={handleAddTask}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-3"
              >
                <textarea
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full p-2 border border-slate-200 rounded-md resize-none text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  rows="2"
                  autoFocus
                />
                <div className="flex justify-between mt-3">
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-3 py-1.5 text-xs font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingTask(false)}
                    className="text-slate-500 hover:text-slate-700 text-xs px-2 py-1.5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setIsAddingTask(true)}
              className="flex items-center w-full px-3 py-2.5 mt-2 text-slate-600 hover:bg-white/80 rounded-lg text-sm border border-dashed border-slate-300 hover:border-slate-400 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              <span>Add task</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
