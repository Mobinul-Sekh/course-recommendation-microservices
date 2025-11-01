# Course Management Microservice

A comprehensive platform for managing university courses, user authentication, and course recommendations using a microservices architecture with modern web technologies.

## Features

- **User Authentication** - Secure JWT-based authentication for administrators
- **Course Management** - CRUD operations with CSV bulk upload support
- **Advanced Search** - Full-text search powered by Elasticsearch
- **Real-time Caching** - Performance optimization using Redis
- **RESTful APIs** - Well-documented with Swagger UI
- **Responsive UI** - Built with Next.js and Tailwind CSS
- **Containerized** - Easy deployment with Docker

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **UI Components**: Shadcn/ui
- **HTTP Client**: Axios

### Backend Services
- **Runtime**: Node.js 18+
- **API**: Express.js
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI

### Data Layer
- **Primary Database**: MongoDB
- **Search Engine**: Elasticsearch 8.x
- **Caching**: Redis
- **File Processing**: Multer, CSV Parser

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Environment Management**: dotenv
- **CORS**: Enabled with secure defaults

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ and npm 9+ or yarn
- MongoDB 6.0+
- Redis 7.0+
- Elasticsearch 8.11+

## Project Structure

```
├── client/                      # Next.js frontend application
│   ├── src/
│   │   ├── app/                # App router pages
│   │   ├── components/         # Reusable UI components
│   │   ├── lib/                # API clients and utilities
│   │   └── styles/             # Global styles
│
├── server/
│   ├── auth-service/           # Authentication & authorization
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   └── server.js           # Express server
│   │
│   ├── course-service/         # Course management
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API endpoints
│   │   └── uploads/            # File uploads directory
│   │
│   └── recommendation-service/ # AI recommendations
│
├── docker-compose.yml          # Service orchestration
└── README.md                  # Project documentation
```

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-name>
```

### 2. Environment Configuration

#### Auth Service (`server/auth-service/.env`)
```env
MONGO_URI=mongodb://localhost:27017/auth-ms-db
PORT=7001
JWT_SECRET=your-secure-jwt-secret
NODE_ENV=development
```

#### Course Service (`server/course-service/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/course-ms-db
ELASTICSEARCH_NODE_URL=http://elasticsearch:8200
PORT=7003
REDIS_HOST=redis
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:9002
NODE_ENV=development
```

### 3. Start with Docker (Recommended)

```bash
docker-compose up -d
```

This will start all services:
- Frontend: http://localhost:9002
- Auth Service: http://localhost:7001
- Course Service: http://localhost:7003
- MongoDB: localhost:27017
- Redis: localhost:6379
- Elasticsearch: http://localhost:8200
- Swagger UI: http://localhost:7003/api-docs

### 4. Development Setup

#### Frontend Development
```bash
cd client
npm install
npm run dev
```

#### Backend Development
```bash
# Install dependencies for all services
cd server
for dir in */; do (cd "$dir" && npm install); done

# Start individual services
cd auth-service && npm run dev
cd ../course-service && npm run dev
```

## API Documentation

### Auth Service
- `POST /api/auth/signup` - Register a new admin
- `POST /api/auth/login` - Login admin

### Course Service
- `POST /api/courses/upload` - Upload courses from CSV file
- `GET /api/courses/search` - Search courses

### Recommendation Service
- `POST /api/recommendations` - Get course recommendations

## Pending Front-end Tasks

1. **Course Search Implementation**
   - [ ] Implement search API endpoints with filters and sorting
   - [ ] Add search UI components in the frontend

2. **Recommendation System**
   - [ ] Integrate recommendations with the frontend
   - [ ] Add user interaction tracking to improve recommendations

## Environment Variables

Key environment variables for different services:

### Auth Service
- `MONGO_URI`: MongoDB connection string
- `PORT`: Service port (default: 7001)
- `JWT_SECRET`: Secret for JWT token signing

### Course Service
- `MONGODB_URI`: MongoDB connection string
- `ELASTICSEARCH_NODE_URL`: Elasticsearch URL
- `REDIS_HOST`: Redis host
- `REDIS_PORT`: Redis port

## Deployment

### Production Build

1. Build the frontend:
```bash
cd client
npm run build
```

2. Start production services:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes (Optional)

For Kubernetes deployment, refer to the `k8s/` directory for deployment manifests.

## Troubleshooting

- **MongoDB connection issues**: Ensure MongoDB is running and the connection string is correct
- **CORS errors**: Verify CORS_ORIGIN is set correctly in environment variables
- **Port conflicts**: Check if required ports are available

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
