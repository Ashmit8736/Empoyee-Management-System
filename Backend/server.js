const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/employee", require("./routes/employeeRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
