// sockets/socketManager.js
const taskController = require("../controllers/taskController");

class SocketManager {
  constructor(io) {
    this.io = io;
    this.setupConnectionHandlers();
  }

  setupConnectionHandlers() {
    this.io.on("connection", async (socket) => {
      console.log("User connected:", socket.id);

      // Send all tasks to newly connected client
      await taskController.syncTasks(socket);

      // Register WebSocket event handlers
      this.registerEventHandlers(socket);

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });
  }

  registerEventHandlers(socket) {
    // 1. Create a new task
    socket.on("task:create", async (taskData) => {
      try {
        await taskController.createTask(this.io, taskData);
      } catch (error) {
        console.error("Error creating task:", error);
        socket.emit("error", { message: "Failed to create task" });
      }
    });

    // 2. Update an existing task
    socket.on("task:update", async (taskData) => {
      try {
        await taskController.updateTask(this.io, taskData);
      } catch (error) {
        console.error("Error updating task:", error);
        socket.emit("error", { message: "Failed to update task" });
      }
    });

    // 3. Move a task between columns
    socket.on("task:move", async (data) => {
      try {
        await taskController.moveTask(this.io, data);
      } catch (error) {
        console.error("Error moving task:", error);
        socket.emit("error", { message: "Failed to move task" });
      }
    });

    // 4. Delete a task
    socket.on("task:delete", async (data) => {
      try {
        await taskController.deleteTask(this.io, data);
      } catch (error) {
        console.error("Error deleting task:", error);
        socket.emit("error", { message: "Failed to delete task" });
      }
    });
  }
}

module.exports = SocketManager;
