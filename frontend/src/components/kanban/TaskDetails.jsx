// src/components/kanban/TaskDetails.jsx
import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { TaskForm } from "./TaskForm";
import { useKanban } from "../../context/kanbanContext";

export const TaskDetails = ({ task, isOpen, onClose }) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { deleteTask } = useKanban();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTask(task._id, task.status);
      onClose();
    }
  };

  const isImage =
    task.attachment &&
    task.attachment.type &&
    task.attachment.type.startsWith("image/");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (showEditForm) {
    return (
      <TaskForm
        task={task}
        isOpen={true}
        onClose={() => {
          setShowEditForm(false);
          onClose();
        }}
      />
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title}>
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <p className="mt-1 text-sm text-gray-900">
            {task.description || "No description provided."}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Status</h4>
            <p className="mt-1 text-sm text-gray-900 capitalize">
              {task.status === "inProgress" ? "In Progress" : task.status}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Priority</h4>
            <div className="mt-1">
              <Badge type="priority" text={task.priority} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Category</h4>
            <div className="mt-1">
              <Badge type="category" text={task.category} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Created</h4>
            <p className="mt-1 text-sm text-gray-900">
              {formatDate(task.createdAt)}
            </p>
          </div>
        </div>

        {task.attachment && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Attachment</h4>
            <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-200">
              {isImage ? (
                <div className="space-y-3">
                  <img
                    src={task.attachment.dataUrl}
                    alt="Attachment preview"
                    className="max-h-56 rounded-md object-contain mx-auto shadow-sm"
                  />
                  <div className="flex items-center justify-center space-x-2">
                    <div className="flex items-center text-sm text-gray-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {task.attachment.name} (
                        {Math.round(task.attachment.size / 1024)} KB)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="p-3 bg-white rounded-lg border border-gray-200 mr-3">
                    {task.attachment.type?.includes("pdf") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 4v3a1 1 0 001 1h3M10 14l2 2m0 0l2-2m-2 2V8"
                        />
                      </svg>
                    ) : task.attachment.type?.includes("word") ||
                      task.attachment.type?.includes("doc") ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 4v3a1 1 0 001 1h3"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-700">
                      {task.attachment.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(task.attachment.size / 1024)} KB •{" "}
                      {task.attachment.type
                        ? task.attachment.type.split("/")[1].toUpperCase()
                        : "Document"}
                    </p>
                    <p className="text-xs text-indigo-600 mt-1">
                      Stored at: {task.attachment.url}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* {task.attachment && (
          <div>
            <h4 className="text-sm font-medium text-gray-500">Attachment</h4>
            <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {isImage ? (
                <img
                  src={task.attachment.dataUrl}
                  alt="Attachment preview"
                  className="max-h-56 rounded-md object-contain mx-auto"
                />
              ) : (
                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {task.attachment.name}
                </div>
              )}
            </div>
          </div>
        )} */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={() => setShowEditForm(true)}>
            Edit
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </Modal>
  );
};

// // src/components/kanban/TaskDetails.jsx
// import { useState } from "react";
// import { Modal } from "../ui/Modal";
// import { Button } from "../ui/Button";
// import { Badge } from "../ui/Badge";
// import { TaskForm } from "./TaskForm";
// import { useKanban } from "../../context/kanbanContext";
// import { motion } from "framer-motion";
// import {
//   TrashIcon,
//   PencilIcon,
//   XMarkIcon,
//   DocumentTextIcon,
//   ClockIcon,
//   TagIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
//   PaperClipIcon,
// } from "@heroicons/react/24/outline";

// export const TaskDetails = ({ task, isOpen, onClose }) => {
//   const [showEditForm, setShowEditForm] = useState(false);
//   const { deleteTask } = useKanban();

//   const handleDelete = () => {
//     if (confirm("Are you sure you want to delete this task?")) {
//       deleteTask(task._id, task.status);
//       onClose();
//     }
//   };

//   const isImage =
//     task.attachment &&
//     task.attachment.type &&
//     task.attachment.type.startsWith("image/");

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   if (showEditForm) {
//     return (
//       <TaskForm
//         task={task}
//         isOpen={true}
//         onClose={() => {
//           setShowEditForm(false);
//           onClose();
//         }}
//       />
//     );
//   }

//   // Color mapping based on priority
//   const priorityColors = {
//     low: "bg-emerald-50 text-emerald-700 border-emerald-200",
//     medium: "bg-amber-50 text-amber-700 border-amber-200",
//     high: "bg-rose-50 text-rose-700 border-rose-200",
//   };

//   // Color mapping based on status
//   const statusColors = {
//     todo: "bg-slate-50 text-slate-700 border-slate-200",
//     inProgress: "bg-blue-50 text-blue-700 border-blue-200",
//     done: "bg-green-50 text-green-700 border-green-200",
//   };

//   // Status icon based on status
//   const StatusIcon = () => {
//     if (task.status === "done") {
//       return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
//     } else if (task.status === "inProgress") {
//       return (
//         <motion.div
//           className="h-5 w-5 text-blue-500"
//           animate={{ rotate: 360 }}
//           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
//         >
//           <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeDasharray="5 5"
//             />
//           </svg>
//         </motion.div>
//       );
//     } else {
//       return <ExclamationCircleIcon className="h-5 w-5 text-slate-500" />;
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} title={task.title} size="lg">
//       <div className="space-y-6">
//         {/* Description Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3 }}
//           className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
//         >
//           <div className="flex items-center mb-2">
//             <DocumentTextIcon className="h-5 w-5 text-indigo-500 mr-2" />
//             <h4 className="text-sm font-semibold text-slate-700">
//               Description
//             </h4>
//           </div>
//           <p className="mt-2 text-slate-600 leading-relaxed">
//             {task.description || (
//               <span className="italic text-slate-400">
//                 No description provided.
//               </span>
//             )}
//           </p>
//         </motion.div>

//         {/* Task Details in Card Grid */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.1 }}
//           className="grid grid-cols-1 md:grid-cols-2 gap-4"
//         >
//           {/* Status Card */}
//           <div
//             className={`p-4 rounded-xl border ${
//               statusColors[task.status]
//             } shadow-sm`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <StatusIcon />
//                 <h4 className="text-sm font-semibold ml-2 text-slate-700">
//                   Status
//                 </h4>
//               </div>
//               <span
//                 className={`px-2.5 py-1 rounded-full text-xs font-medium ${
//                   statusColors[task.status]
//                 }`}
//               >
//                 {task.status === "inProgress"
//                   ? "In Progress"
//                   : task.status === "todo"
//                   ? "To Do"
//                   : "Done"}
//               </span>
//             </div>
//           </div>

//           {/* Priority Card */}
//           <div
//             className={`p-4 rounded-xl border ${
//               priorityColors[task.priority]
//             } shadow-sm`}
//           >
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <TagIcon className="h-5 w-5 text-slate-500" />
//                 <h4 className="text-sm font-semibold ml-2 text-slate-700">
//                   Priority
//                 </h4>
//               </div>
//               <Badge type="priority" text={task.priority} />
//             </div>
//           </div>

//           {/* Category Card */}
//           <div className="p-4 rounded-xl border border-slate-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <TagIcon className="h-5 w-5 text-slate-500" />
//                 <h4 className="text-sm font-semibold ml-2 text-slate-700">
//                   Category
//                 </h4>
//               </div>
//               <Badge type="category" text={task.category} />
//             </div>
//           </div>

//           {/* Created Date Card */}
//           <div className="p-4 rounded-xl border border-slate-200 shadow-sm">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <ClockIcon className="h-5 w-5 text-slate-500" />
//                 <h4 className="text-sm font-semibold ml-2 text-slate-700">
//                   Created
//                 </h4>
//               </div>
//               <p className="text-sm text-slate-600 font-medium">
//                 {formatDate(task.createdAt)}
//               </p>
//             </div>
//           </div>
//         </motion.div>

//         {/* Attachment Section */}
//         {task.attachment && (
//           <motion.div
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.3, delay: 0.2 }}
//             className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm"
//           >
//             <div className="flex items-center mb-3">
//               <PaperClipIcon className="h-5 w-5 text-indigo-500 mr-2" />
//               <h4 className="text-sm font-semibold text-slate-700">
//                 Attachment
//               </h4>
//             </div>
//             <div
//               className={`mt-2 bg-slate-50 p-4 rounded-xl border border-slate-200 ${
//                 isImage ? "text-center" : ""
//               }`}
//             >
//               {isImage ? (
//                 <div className="space-y-3">
//                   <img
//                     src={task.attachment.dataUrl}
//                     alt="Attachment preview"
//                     className="max-h-64 rounded-lg object-contain mx-auto shadow-sm"
//                   />
//                   <div className="flex items-center justify-center text-sm text-slate-600">
//                     <PaperClipIcon className="h-4 w-4 mr-1 text-slate-400" />
//                     {task.attachment.name}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center">
//                   <div className="p-3 bg-white rounded-lg border border-slate-200 mr-3">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="h-8 w-8 text-slate-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-medium text-sm text-slate-700">
//                       {task.attachment.name}
//                     </p>
//                     <p className="text-xs text-slate-500 mt-1">Document</p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Action Buttons */}
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.3, delay: 0.3 }}
//           className="flex justify-end space-x-3 pt-2"
//         >
//           <Button
//             variant="danger"
//             onClick={handleDelete}
//             className="flex items-center"
//           >
//             <TrashIcon className="h-4 w-4 mr-1.5" />
//             Delete
//           </Button>
//           <Button
//             variant="secondary"
//             onClick={() => setShowEditForm(true)}
//             className="flex items-center"
//           >
//             <PencilIcon className="h-4 w-4 mr-1.5" />
//             Edit
//           </Button>
//           <Button onClick={onClose} className="flex items-center">
//             <XMarkIcon className="h-4 w-4 mr-1.5" />
//             Close
//           </Button>
//         </motion.div>
//       </div>
//     </Modal>
//   );
// };
