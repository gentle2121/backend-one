const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  reply: { type: String, required: true },
  parentName: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String },
  createdBy: { type: String, required: true },
  replies: [replySchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Discussion", discussionSchema);
