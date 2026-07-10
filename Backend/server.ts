import express, { Express } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import initSocket from "./config/socket";
import setupSwagger from "./config/swagger";
import {
  strictLimiter,
  employerLimiter,
  publicLimiter,
} from "./middleware/rateLimiter";


// Import Routes
import jobRoutes from "./routes/jobRoute"
import authRoutes from './routes/authRoute'
import applicationRoutes from "./routes/applicationRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import adminRoutes from "./routes/adminRoutes"

dotenv.config();

const app: Express = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Socket.io 
const io = initSocket(server)
app.set("io",io)

// Swagger 
setupSwagger(app)
// Job Routes
app.use("/api", jobRoutes);
// Auth
app.use('/api',strictLimiter,authRoutes)
// Application 
app.use("/api",employerLimiter,applicationRoutes)
// Notification
app.use("/api",publicLimiter,notificationRoutes)
// Admin
app.use("/api",strictLimiter,adminRoutes)


// Health cheack
app.get("/", (req, res) => {
  res.json("Job board is working successfully");
});

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
  });
});
