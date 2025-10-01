const mongoose = require("mongoose");

const PrimaryStudentSchema = new mongoose.Schema(
  {
    studentEmail: String,
    fullName: String,
    dob: String,
    placeOfBirth: String,
    nationality: String,
    stateOfOrigin: String,
    address: String,
    phone: String,
    classApplying: String,
    gender: String,
    passportPhoto: String, // file path or base64

    parentName: String,
    parentEmail: String,
    parentPhone: String,
    parentAddress: String,

    paymentProof: String, // file path or base64
    studentCode: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PrimaryStudent", PrimaryStudentSchema);
