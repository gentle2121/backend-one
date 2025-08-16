const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const cors = require("cors");
const bodyParser = require("body-parser");

const UserRoutes = require("./routes/UserRoutes");
const taskRoutes = require("./routes/TaskRoutes");

connectDB();
const app = express();

app.use(cors({ origin: "http://localhost:5173" })); 
app.use(express.json());
app.use(bodyParser.json());


app.use("/api/Task", taskRoutes);
app.use("/api/User", UserRoutes);

// Port
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Server running on port ${port}`.yellow.bold)
);
