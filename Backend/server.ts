import express, { Express } from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
dotenv.config();
import initSocket from "./config/socket";
import setupSwagger from "./config/swagger";
import helmet from "helmet";
import {
  strictLimiter
} from "./middleware/rateLimiter";


// Import Routes
import jobRoutes from "./routes/jobRoute"
import authRoutes from './routes/authRoute'
import applicationRoutes from "./routes/applicationRoutes"
import notificationRoutes from "./routes/notificationRoutes"
import adminRoutes from "./routes/adminRoutes"


const app: Express = express();
const server = http.createServer(app);
app.use(helmet())

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PATCH", "DELETE"],
  credentials: true
}))

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ extended: true, limit: "10kb" }))
const port = 3000;

// Socket.io 
const io = initSocket(server)
app.set("io",io)

// Swagger 
setupSwagger(app)
// Job Routes
app.use("/api", jobRoutes);
// Auth
app.use('/api',authRoutes)
// Application 
app.use("/api",applicationRoutes)
// Notification
app.use("/api",notificationRoutes)
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
