// controllers/taskController.js
const taskService = require("../services/taskService");

const taskController = {
  // Send all tasks to client for initial sync
  async syncTasks(socket) {
    try {
      const tasks = await taskService.getAllTasks();
      socket.emit("sync:tasks", tasks);
    } catch (error) {
      console.error("Error syncing tasks:", error);
      socket.emit("error", { message: "Failed to sync tasks" });
    }
  },

  // Handle task creation
  async createTask(io, taskData) {
    try {
      const newTask = await taskService.createTask(taskData);

      // Broadcast to all clients
      io.emit("task:created", newTask);

      // Sync all tasks to ensure consistency
      const tasks = await taskService.getAllTasks();
      io.emit("sync:tasks", tasks);

      console.log("Task created:", newTask.title);
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      io.emit("error", { message: "Failed to create task" });
      return null;
    }
  },

  // Handle task updates
  async updateTask(io, taskData) {
    try {
      const updatedTask = await taskService.updateTask(taskData);

      if (updatedTask) {
        io.emit("task:updated", updatedTask);

        // Sync all tasks to ensure consistency
        const tasks = await taskService.getAllTasks();
        io.emit("sync:tasks", tasks);

        console.log("Task updated:", updatedTask.title);
      }

      return updatedTask;
    } catch (error) {
      console.error("Error updating task:", error);
      io.emit("error", { message: "Failed to update task" });
      return null;
    }
  },

  // Handle moving tasks between columns
  async moveTask(io, data) {
    try {
      const { id, source, destination } = data;
      const movedTask = await taskService.moveTask(id, source, destination);

      if (movedTask) {
        io.emit("task:moved", { task: movedTask, source, destination });

        // Sync all tasks to ensure consistency
        const tasks = await taskService.getAllTasks();
        io.emit("sync:tasks", tasks);

        console.log(
          `Task moved: ${movedTask.title} from ${source} to ${destination}`
        );
      }

      return movedTask;
    } catch (error) {
      console.error("Error moving task:", error);
      io.emit("error", { message: "Failed to move task" });
      return null;
    }
  },

  // Handle task deletion
  async deleteTask(io, data) {
    try {
      const { id } = data;
      const deletedTask = await taskService.deleteTask(id);

      if (deletedTask) {
        io.emit("task:deleted", deletedTask);

        // Sync all tasks to ensure consistency
        const tasks = await taskService.getAllTasks();
        io.emit("sync:tasks", tasks);

        console.log("Task deleted:", deletedTask.title);
      }

      return deletedTask;
    } catch (error) {
      console.error("Error deleting task:", error);
      io.emit("error", { message: "Failed to delete task" });
      return null;
    }
  },
};

module.exports = taskController;
