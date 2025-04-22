// services/taskService.js
const Task = require("../models/Task");

class TaskService {
  async getAllTasks() {
    try {
      // Group tasks by status
      const todoTasks = await Task.find({ status: "todo" }).sort({
        createdAt: -1,
      });
      const inProgressTasks = await Task.find({ status: "inProgress" }).sort({
        createdAt: -1,
      });
      const doneTasks = await Task.find({ status: "done" }).sort({
        createdAt: -1,
      });

      return {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks,
      };
    } catch (error) {
      console.error("Error getting all tasks:", error);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const newTask = new Task(taskData);
      await newTask.save();
      return newTask;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async updateTask(taskData) {
    try {
      const { id, ...updates } = taskData;

      // Find task and update
      const task = await Task.findById(id);
      if (!task) return null;

      // Apply updates
      task.updateTask(updates);
      await task.save();

      return task;
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async moveTask(id, source, destination) {
    try {
      // Find the task
      const task = await Task.findById(id);
      if (!task) return null;

      // Update status and save
      task.status = destination;
      task.updatedAt = new Date();
      await task.save();

      return task;
    } catch (error) {
      console.error("Error moving task:", error);
      throw error;
    }
  }

  async deleteTask(id) {
    try {
      const task = await Task.findByIdAndDelete(id);
      return task;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

module.exports = new TaskService();
