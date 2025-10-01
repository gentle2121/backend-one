const express = require("express");
const jwt = require("jsonwebtoken");
const Discussion = require("../models/Discussionmodel");
const Student = require("../models/Studentmodel"); // from your registration model
const auth = require("../Middleware/Authforum");

const router = express.Router();

// ✅ Parent login with studentCode + parentName
router.post("/login", async (req, res) => {
  try {
    const { studentCode, parentName } = req.body;

    if (!studentCode || !parentName) {
      return res.status(400).json({ success: false, error: "Missing credentials" });
    }

    const student = await Student.findOne({ studentCode, parentName });

    if (!student) {
      return res.status(400).json({ success: false, error: "Invalid student code or parent name" });
    }

    const token = jwt.sign(
      { studentCode: student.studentCode, parentName: student.parentName },
      process.env.JWT_SECRET || "supersecretkey",
      { expiresIn: "2h" }
    );

    res.json({
      success: true,
      token,
      parent: student.parentName
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ✅ Get all discussions (protected)
router.get("/discussions", auth, async (req, res) => {
  try {
    const discussions = await Discussion.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      discussions,
      parent: req.user.parentName
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Could not fetch discussions" });
  }
});

// ✅ Post a new discussion
router.post("/discussions", auth, async (req, res) => {
  try {
    const { title, body } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, error: "Title is required" });
    }

    const discussion = new Discussion({
      title,
      body,
      createdBy: req.user.parentName
    });

    await discussion.save();

    res.json({ success: true, discussion });
  } catch (err) {
    console.error("Post discussion error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ✅ Post a reply to a discussion
router.post("/discussions/:id/replies", auth, async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply) {
      return res.status(400).json({ success: false, error: "Reply text is required" });
    }

    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ success: false, error: "Discussion not found" });
    }

    discussion.replies.push({
      reply,
      parentName: req.user.parentName
    });

    await discussion.save();

    res.json({ success: true, discussion });
  } catch (err) {
    console.error("Reply error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
