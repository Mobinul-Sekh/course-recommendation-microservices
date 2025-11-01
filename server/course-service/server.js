import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Redis from "ioredis";
import courseRoutes from "./routes/courseRoutes.js";
import swaggerSetup from "./swagger.js";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);

const allowedOrigin = process.env.CORS_ORIGIN || "http://localhost:9002";

app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if you're sending cookies or auth headers
}));

// Swagger Documentation
swaggerSetup(app);

// Database Connections
Promise.all([
  // MongoDB Connection
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }),

  // Redis Connection
  (async () => {
    try {
      const redis = new Redis({ 
        host: process.env.REDIS_HOST, 
        port: process.env.REDIS_PORT 
      });
      
      redis.on('error', (err) => {
        console.error('Redis error:', err);
        process.exit(1);
      });
      
      redis.on('connect', () => {
        console.log('Redis connected successfully');
      });
      
      return redis;
    } catch (err) {
      console.error('Redis connection error:', err);
      process.exit(1);
    }
  })()
]).catch(err => {
  console.error('Failed to initialize services:', err);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// Start server
const PORT = process.env.PORT || 7003;
const server = app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  server.close(() => process.exit(1));
});

// Export Redis client
const redis = new Redis({ 
  host: process.env.REDIS_HOST, 
  port: process.env.REDIS_PORT 
});

export { redis };
