import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import swaggerSetup from "./swagger.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 7001;

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

// Routes
app.use("/api/auth", authRoutes);

// Swagger Documentation
swaggerSetup(app);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Successfully connected to MongoDB");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
});

// Start server
app.listen(port, () => {
    console.log(`Auth server is running on port ${port}`);
    console.log(`API Documentation available at http://localhost:${port}/api-docs`);
});

// Error handling
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});
