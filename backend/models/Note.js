const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
  dueDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Note", NoteSchema);
