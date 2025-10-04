const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");
const path =require("path")
const UserRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");
const StudentRoutes = require("./routes/StudentRoutes");
const forumRoutes = require("./routes/ForumRoutes")
const primaryRoutes=require("./routes/PrimaryRoutes")
connectDB();
const app = express();

// app.use(cors({ origin: "http://localhost:5173" })); 

const allowedOrigins = [
  "http://localhost:5173",                // local frontend (Vite)
  "https://vincentacademy.netlify.app/"     // replace with your actual Netlify URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));




app.use(express.json());
app.use(bodyParser.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // serve uploaded files

// Routes
app.use("/api/PrimaryStudent", primaryRoutes);
app.use("/api/Student",StudentRoutes );
app.use("/api/forum", forumRoutes);
app.use("/api/Task", taskRoutes);
app.use("/api/User", UserRoutes);

// Port
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server running on port ${port}`.yellow.bold)
);
