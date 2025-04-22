import { useState, useEffect } from "react";
import { Column } from "./Column";
import { TaskForm } from "./TaskForm";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { useKanban } from "../../context/kanbanContext";
import { TaskProgressChart } from "../charts/TaskProgressChart";
import { motion, AnimatePresence } from "framer-motion";
import { PlusIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export const KanbanBoard = () => {
  const { tasks, isLoading, isConnected } = useKanban();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showCharts, setShowCharts] = useState(true);

  // Total tasks count
  const totalTasks = tasks
    ? tasks.todo.length + tasks.inProgress.length + tasks.done.length
    : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 w-full">
        <LoadingSpinner />
        <p className="mt-4 text-slate-600 animate-pulse">
          Syncing your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Action toolbar */}
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <div className="mr-4">
              <h2 className="text-lg font-semibold text-slate-800">Tasks</h2>
              <div className="flex items-center text-sm text-slate-500 mt-0.5">
                <span className="flex items-center">
                  <span
                    className={`mr-1.5 w-2 h-2 rounded-full ${
                      isConnected ? "bg-emerald-500" : "bg-orange-500"
                    }`}
                  ></span>
                  {isConnected ? "Connected" : "Connecting..."}
                </span>
                <span className="mx-2">•</span>
                <span>
                  {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="inline-flex items-center px-3 py-2 border border-slate-200 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <ChartBarIcon className="h-4 w-4 mr-2 text-slate-500" />
              {showCharts ? "Hide" : "Show"} Analytics
            </button>

            <button
              onClick={() => setShowTaskForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <PlusIcon className="h-4 w-4 mr-2" /> New Task
            </button>
          </div>
        </div>
      </div>

      {/* Charts section - with animation */}
      <AnimatePresence>
        {showCharts && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-6 overflow-hidden"
          >
            <h3 className="text-lg font-semibold mb-4 text-slate-800 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-indigo-500" />
              Task Analytics
            </h3>
            <TaskProgressChart tasks={tasks} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Column
          title="To Do"
          icon={
            <svg
              className="h-5 w-5 text-slate-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                clipRule="evenodd"
              />
            </svg>
          }
          status="todo"
          tasks={tasks.todo}
          color="bg-slate-50"
          borderColor="border-slate-200"
          headingColor="text-slate-700"
          accentColor="bg-slate-600"
        />
        <Column
          title="In Progress"
          icon={
            <svg
              className="h-5 w-5 text-amber-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          }
          status="inProgress"
          tasks={tasks.inProgress}
          color="bg-amber-50"
          borderColor="border-amber-200"
          headingColor="text-amber-800"
          accentColor="bg-amber-500"
        />
        <Column
          title="Done"
          icon={
            <svg
              className="h-5 w-5 text-emerald-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          }
          status="done"
          tasks={tasks.done}
          color="bg-emerald-50"
          borderColor="border-emerald-200"
          headingColor="text-emerald-800"
          accentColor="bg-emerald-500"
        />
      </div>

      <TaskForm isOpen={showTaskForm} onClose={() => setShowTaskForm(false)} />
    </div>
  );
};
