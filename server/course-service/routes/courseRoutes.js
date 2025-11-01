import express from "express";
import multer from "multer";
import csvParser from "csv-parser";
import fs from "fs";
import Course from "../models/Course.js";
import { redis } from "../server.js";
import { Client } from "@elastic/elasticsearch";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const esClient = new Client({ node: process.env.ELASTICSEARCH_NODE_URL || "http://localhost:8200" });

// Validate data against Course schema
const validateCourseData = (data) => {
  const requiredFields = ['course_id', 'title', 'description', 'category', 'instructor', 'duration'];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}` };
  }
  
  // Additional validation rules can be added here
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    return { valid: false, error: 'Title must be a non-empty string' };
  }
  
  return { valid: true };
};

// Upload CSV and insert to MongoDB
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const results = [];
    const validationErrors = [];
    
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (data) => {
        const validation = validateCourseData(data);
        if (!validation.valid) {
          validationErrors.push({
            row: results.length + 1,
            error: validation.error,
            data
          });
        } else {
          results.push(data);
        }
      })
      .on("end", async () => {
        if (validationErrors.length > 0) {
          return res.status(400).json({
            error: "Validation failed for some rows",
            failedRows: validationErrors,
            validRows: results.length,
            invalidRows: validationErrors.length
          });
        }
        
        try {
          const inserted = await Course.insertMany(results, { ordered: false });

          // Index into Elasticsearch
          for (const course of inserted) {
            await esClient.index({
              index: "courses",
              id: course.course_id,
              document: {
                title: course.title,
                description: course.description,
                category: course.category,
                instructor: course.instructor
              },
            });
          }

          await esClient.indices.refresh({ index: "courses" });

          res.json({ 
            success: true,
            message: "Courses uploaded successfully", 
            count: results.length 
          });
        } catch (dbError) {
          res.status(500).json({
            error: "Database error",
            details: dbError.message
          });
        } finally {
          // Clean up uploaded file
          fs.unlink(req.file.path, (err) => {
            if (err) console.error('Error deleting temp file:', err);
          });
        }
      });
  } catch (err) {
    res.status(500).json({ 
      error: "Server error",
      details: err.message 
    });
  }
});

// Search (with Redis + Elasticsearch)
router.get("/search", async (req, res) => {
  const { q } = req.query;
  const cacheKey = `course_search:${q}`;

  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  const { body } = await esClient.search({
    index: "courses",
    query: {
      multi_match: { query: q, fields: ["title", "description", "category", "instructor"] },
    },
  });

  const hits = body.hits.hits.map(hit => hit._source);

  await redis.setex(cacheKey, 3600, JSON.stringify(hits)); // cache 1 hour
  res.json(hits);
});

export default router;
