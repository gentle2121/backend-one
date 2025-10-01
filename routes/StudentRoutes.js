const express = require("express");
const { createStudent, finalizeStudent } = require("../CONTROLLER/Studentcontroller");
const upload = require("../Middleware/Middleware"); // multer config

const router = express.Router();

// Step 1 → Register student (basic info)
router.post("/", createStudent);

// Step 6 → Finalize student (with parent info + file uploads)
router.post(
  "/finalize",
  upload.fields([
    { name: "passportPhoto", maxCount: 1 },
    { name: "birthCert", maxCount: 1 },
    { name: "transcript", maxCount: 1 },
    { name: "paymentProof", maxCount: 1 },
  ]),
  finalizeStudent
);



module.exports = router;
