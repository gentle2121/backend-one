const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentCode: { type: String, unique: true, required: true },

  // Step 1: Student info
  studentEmail: { type: String, required: true },
  surname: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: String,
  presentSchool: { type: String, required: true },
  dob: { type: Date, required: true },
  placeOfBirth: { type: String, required: true },
  nationality: String,
  stateOfOrigin: String,
  address: String,
  area: String,
  phone: String,
  currentClass: String,
  religion: String,
  denomination: String,
  schoolInterest: String,
  classInterest: String,
  department: String,
  gender: { type: String, enum: ["Male", "Female"], required: true },
  homePhone: String,
  source: String,

  // ✅ File paths (store as strings, optional until finalize)
  passportPhoto: { type: String, default: "" },
  birthCert: { type: String, default: "" },
  transcript: { type: String, default: "" },
  paymentProof: { type: String, default: "" },

  // Step 2: Parent info
  parentName: { type: String, default: "" },
  parentEmail: { type: String, default: "" },
  parentPhone: { type: String, default: "" },
  parentAddress: { type: String, default: "" },
});

module.exports = mongoose.model("Student", studentSchema);
