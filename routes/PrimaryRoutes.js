const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createStudent,
  finalizeStudent,
  
} = require("../CONTROLLER/Primarycontroller");

const router = express.Router();

// File storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save in backend/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Step 1
router.post("/", createStudent);

// Final Step
router.post(
  "/finalize",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
  ]),
  finalizeStudent
);


module.exports = router;
