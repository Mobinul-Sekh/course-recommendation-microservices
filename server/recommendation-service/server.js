import express from "express";
import dotenv from "dotenv";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import swaggerSetup from "./swagger.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7002;

// Middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use("/api/recommendations", recommendationRoutes);

// Swagger Documentation
swaggerSetup(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The requested resource ${req.originalUrl} was not found`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  const statusCode = err.statusCode || 500;
  const errorResponse = {
    error: err.name || 'Internal Server Error',
    message: err.message || 'Something went wrong!',
  };

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// Start server
const server = app.listen(port, () => {
  console.log(`Recommendation service running on port ${port}`);
  console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});

export default server;
