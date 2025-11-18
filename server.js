require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// ----------------- CORS CONFIG -----------------
const allowedOrigins = [
  process.env.CLIENT_URL,       // 生产前端，比如：https://nexa-tasks.vercel.app
  "http://localhost:5173",      // 本地 Vite
  "http://localhost:3000",      // 预留本地 React
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Postman、curl 等没有 origin 的请求，直接放行
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn("CORS blocked request from origin:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// ----------------- CONNECT DATABASE -----------------
connectDB();

// ----------------- MIDDLEWARES -----------------
app.use(express.json()); // 解析 JSON 请求体

// ----------------- ROUTES -----------------
app.get("/", (req, res) => {
  res.send("Nexa Tasks API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// 静态资源：上传文件
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------- START SERVER -----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
