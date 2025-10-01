const Student = require("../models/Studentmodel");

// ✅ Generate unique student code
const generateStudentCode = () => {
  return "VCA-" + Date.now().toString().slice(-6);
};

// =========================
// Step 1: Create Student (basic info)
// =========================
const createStudent = async (req, res) => {
  try {
    const {
      studentEmail,
      surname,
      firstName,
      presentSchool,
      dob,
      placeOfBirth,
      gender,
    } = req.body;

    if (!studentEmail || !surname || !firstName || !presentSchool || !dob || !placeOfBirth || !gender) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const studentCode = generateStudentCode();

    const newStudent = new Student({
      studentEmail,
      surname,
      firstName,
      presentSchool,
      dob,
      placeOfBirth,
      gender,
      studentCode,
    });

    await newStudent.save();

    res.status(201).json({
      success: true,
      studentCode,
      message: "Student registered. Proceed to next step.",
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// =========================
// Step 6: Finalize Student (parent info + files)
// =========================
const finalizeStudent = async (req, res) => {
  try {
    console.log("📩 Finalize Body:", req.body);
    console.log("📂 Finalize Files:", req.files);

    const { studentCode, parentName, parentEmail, parentPhone, parentAddress } = req.body;

    if (!studentCode) {
      return res.status(400).json({ success: false, message: "Student code is required" });
    }

    const student = await Student.findOne({ studentCode });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // update parent info
    if (parentName) student.parentName = parentName;
    if (parentEmail) student.parentEmail = parentEmail;
    if (parentPhone) student.parentPhone = parentPhone;
    if (parentAddress) student.parentAddress = parentAddress;

    // update files
    if (req.files) {
      if (req.files.passportPhoto?.length) student.passportPhoto = req.files.passportPhoto[0].filename;
      if (req.files.birthCert?.length) student.birthCert = req.files.birthCert[0].filename;
      if (req.files.transcript?.length) student.transcript = req.files.transcript[0].filename;
      if (req.files.paymentProof?.length) student.paymentProof = req.files.paymentProof[0].filename;
    }

    await student.save();

    res.json({
      success: true,
      message: "Student application finalized successfully",
      studentCode,
    });
  } catch (err) {
    console.error("❌ Error finalizing student:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createStudent,
  finalizeStudent,
};
