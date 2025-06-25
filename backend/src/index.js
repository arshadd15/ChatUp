const express = require("express");
const ratelimiter = require("express-rate-limit");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./lib/db");
const authRoutes = require("./routes/auth.routes");
const messageRoutes = require("./routes/message.routes");
const cors = require("cors");
const { app, server } = require("./lib/socket");
const path = require("path");

dotenv.config();

const authLimiter = ratelimiter({
  windowMs: 60 * 1000, //1 minute
  max: 5, //limit each IP to 5 request per windowMs
  message: "Too many login attempts, please try again later.",
});

const messageLimiter = ratelimiter({
  windowMs: 60 * 1000, //1 minute
  max: 15, //limit each IP to 15 request per windowMs
  message: "Too many requests from this IP, please try again later.",
});

const PORT = process.env.PORT;

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/messages", messageLimiter, messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get(
    ("*",
    (req, res) => {
      res.sendFile(
        path.join(__dirname, "../../frontend", "dist", "index.html")
      );
    })
  );
}

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}...`);
  connectDB();
});
