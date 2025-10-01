const PrimaryStudent = require("../models/Primarymodel");
const generateStudentCode = require("../Middleware/Generatecode");

// Step 1: Create student and return code
exports.createStudent = async (req, res) => {
  try {
    const studentCode = generateStudentCode();

    const student = new PrimaryStudent({
      ...req.body,
      studentCode,
    });

    await student.save();

    return res.json({ success: true, studentCode });
  } catch (err) {
    console.error("🔥 Error creating student:", err.message, err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// Final Step: Upload files + finalize
exports.finalizeStudent = async (req, res) => {
  try {
    const { studentCode } = req.body;

    if (!studentCode) {
      return res.status(400).json({ success: false, error: "Student code required" });
    }

    // File handling (if you want to store path)
    let passportPhoto = null;
    let paymentProof = null;
    if (req.files) {
      if (req.files.passportPhoto) {
        passportPhoto = req.files.passportPhoto[0].path;
      }
      if (req.files.paymentProof) {
        paymentProof = req.files.paymentProof[0].path;
      }
    }

    const student = await PrimaryStudent.findOneAndUpdate(
      { studentCode },
      {
        ...req.body,
        ...(passportPhoto && { passportPhoto }),
        ...(paymentProof && { paymentProof }),
      },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, error: "Student not found" });
    }

    return res.json({ success: true, student });
  } catch (err) {
    console.error("🔥 Error finalizing student:", err.message, err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
