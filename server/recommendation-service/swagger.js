import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Recommendation Service API',
      version: '1.0.0',
      description: 'AI-powered course recommendation microservice',
    },
    servers: [
      {
        url: 'http://localhost:7002',
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
        RecommendationRequest: {
          type: 'object',
          required: ['topics', 'skillLevel'],
          properties: {
            topics: {
              type: 'string',
              description: 'Topics or subjects of interest',
              example: 'machine learning, data science',
            },
            skillLevel: {
              type: 'string',
              description: 'Skill level of the user',
              enum: ['beginner', 'intermediate', 'advanced'],
              example: 'intermediate',
            },
          },
        },
        RecommendationResponse: {
          type: 'object',
          properties: {
            recommendations: {
              type: 'array',
              items: {
                type: 'string',
                description: 'Recommended course name',
              },
              example: [
                "Machine Learning A-Z: Hands-On Python & R In Data Science",
                "Deep Learning Specialization",
                "Data Science and Machine Learning Bootcamp with R"
              ],
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
              example: 'Failed to generate recommendations',
            },
          },
        },
      },
    },
    paths: {
      '/api/recommendations': {
        post: {
          tags: ['Recommendations'],
          summary: 'Get course recommendations',
          description: 'Get AI-powered course recommendations based on topics and skill level',
          security: [
            {
              bearerAuth: [],
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/RecommendationRequest',
                },
              },
            },
          },
          responses: {
            200: {
              description: 'Successfully generated recommendations',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RecommendationResponse',
                  },
                },
              },
            },
            400: {
              description: 'Invalid request body',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error',
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
