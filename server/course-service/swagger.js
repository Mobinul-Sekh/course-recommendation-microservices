import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Course Service API',
      version: '1.0.0',
      description: 'Course management and search microservice',
    },
    servers: [
      {
        url: 'http://localhost:7003',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Course: {
          type: 'object',
          required: ['course_id', 'title', 'description', 'category', 'instructor', 'duration'],
          properties: {
            course_id: {
              type: 'string',
              description: 'Unique identifier for the course',
              example: 'CS101',
            },
            title: {
              type: 'string',
              description: 'Title of the course',
              example: 'Introduction to Computer Science',
            },
            description: {
              type: 'string',
              description: 'Detailed description of the course',
              example: 'A comprehensive introduction to computer science fundamentals',
            },
            category: {
              type: 'string',
              description: 'Category of the course',
              example: 'Computer Science',
            },
            instructor: {
              type: 'string',
              description: 'Name of the instructor',
              example: 'John Doe',
            },
            duration: {
              type: 'string',
              description: 'Duration of the course',
              example: '12 weeks',
            },
            level: {
              type: 'string',
              description: 'Difficulty level of the course',
              example: 'Beginner',
              enum: ['Beginner', 'Intermediate', 'Advanced'],
            },
            price: {
              type: 'number',
              description: 'Price of the course',
              example: 99.99,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            details: {
              type: 'string',
              description: 'Detailed error information',
            },
          },
        },
        ValidationError: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Validation failed for some rows',
            },
            failedRows: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  row: {
                    type: 'number',
                    description: 'Row number in the CSV with error',
                  },
                  error: {
                    type: 'string',
                    description: 'Validation error message',
                  },
                  data: {
                    type: 'object',
                    description: 'The data that failed validation',
                  },
                },
              },
            },
            validRows: {
              type: 'number',
              description: 'Number of valid rows in the file',
            },
            invalidRows: {
              type: 'number',
              description: 'Number of invalid rows in the file',
            },
          },
        },
      },
    },
    paths: {
      '/api/courses/upload': {
        post: {
          tags: ['Courses'],
          summary: 'Upload courses via CSV file',
          description: 'Upload a CSV file containing course data to bulk insert into the database and index in Elasticsearch',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    file: {
                      type: 'string',
                      format: 'binary',
                      description: 'CSV file containing course data',
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Courses uploaded successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: {
                        type: 'boolean',
                        example: true,
                      },
                      message: {
                        type: 'string',
                        example: 'Courses uploaded successfully',
                      },
                      count: {
                        type: 'number',
                        description: 'Number of courses successfully processed',
                        example: 10,
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: 'Validation error in the uploaded file',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/ValidationError',
                  },
                },
              },
            },
            401: {
              description: 'Unauthorized - Missing or invalid token',
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
      '/api/courses/search': {
        get: {
          tags: ['Courses'],
          summary: 'Search courses',
          description: 'Search for courses using Elasticsearch with Redis caching',
          parameters: [
            {
              name: 'q',
              in: 'query',
              required: true,
              description: 'Search query string',
              schema: {
                type: 'string',
                example: 'computer science',
              },
            },
          ],
          responses: {
            200: {
              description: 'Search results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Course',
                    },
                  },
                },
              },
            },
            400: {
              description: 'Missing search query',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
            500: {
              description: 'Server error',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

export default (app) => {
  // Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
  // JSON endpoint
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};
