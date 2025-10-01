// controllers/ForumController.js
const jwt = require("jsonwebtoken");
const Student = require("../models/Studentmodel");
const Discussion = require("../models/Discussionmodel");

// ✅ Parent Login
const forumLogin = async (req, res) => {
  try {
    const { studentCode, parentName } = req.body;
    if (!studentCode || !parentName) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const student = await Student.findOne({ studentCode, parentName, status: "completed" });
    if (!student) {
      return res.status(404).json({ success: false, error: "Invalid student code or parent name" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { studentCode: student.studentCode, parentName: student.parentName },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      token,
      parent: student.parentName,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get Discussions (protected)
const getDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 }).limit(20);
    res.json({
      success: true,
      discussions,
      parent: req.parent.parentName,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Create Discussion (protected)
const createDiscussion = async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const discussion = new Discussion({
      title,
      body: body || "",
      createdBy: req.parent.parentName,
    });

    await discussion.save();

    res.status(201).json({
      success: true,
      message: "Discussion created successfully",
      discussion,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { forumLogin, getDiscussions, createDiscussion };
