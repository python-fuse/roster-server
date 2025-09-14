import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { Server } from "socket.io";
import http from "http";

// Import middleware
import { errorHandler } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/requestLogger";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import dutyRosterRouter from "./routes/dutyroster.route";
import assignmentRouter from "./routes/assignment.route";
import notificationRouter from "./routes/notification.route";

// Import Prisma client
import prisma from "./utils/prisma";
import { setupSocketHandlers } from "./handlers/socket.handler";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "my-super-secure-secret",
    saveUninitialized: true,
    resave: false,
    cookie: {
      maxAge: 24 * 3600 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "none",
    },
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // 2 minutes
      dbRecordIdFunction: undefined,
      dbRecordIdIsSessionId: true,
    }),
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/dutyrosters", dutyRosterRouter);
app.use("/api/assignments", assignmentRouter);
app.use("/api/notifications", notificationRouter);

// Error handling middleware
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

setupSocketHandlers(io);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
