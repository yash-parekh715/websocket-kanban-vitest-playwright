// models/Task.js
const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["todo", "inProgress", "done"],
    default: "todo",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  category: {
    type: String,
    enum: ["bug", "feature", "enhancement"],
    default: "feature",
  },
  attachment: {
    type: Object,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

// Update method
TaskSchema.methods.updateTask = function (data) {
  const updates = Object.keys(data);

  updates.forEach((update) => {
    if (update !== "id" && update !== "createdAt") {
      this[update] = data[update];
    }
  });

  this.updatedAt = new Date();
  return this;
};

module.exports = mongoose.model("Task", TaskSchema);
