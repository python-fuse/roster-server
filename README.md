# 🚀 Duty Roster Management System

A comprehensive duty roster management system built with Node.js, Express, TypeScript, Prisma, and Socket.IO for real-time notifications.

## ✨ Features

- **🔐 Authentication & Authorization** - Session-based authentication with role-based access control
- **👥 User Management** - Admin, Supervisor, and Staff role management
- **📅 Duty Roster Management** - Create and manage duty rosters for different shifts
- **📋 Assignment Management** - Assign staff to duty rosters with automatic notifications
- **🔔 Real-time Notifications** - WebSocket-based real-time notifications for assignments and announcements
- **🎯 Role-based Access Control** - Different permissions for Admin, Supervisor, and Staff
- **📊 Database Management** - Prisma ORM with SQLite database
- **🐳 Docker Support** - Containerized deployment

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: Express Sessions with Prisma Session Store
- **Real-time**: Socket.IO
- **Security**: Helmet, CORS, bcrypt
- **Validation**: Express Validator
- **Development**: Nodemon, ts-node

## 📋 Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Docker (optional)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd roster/server
pnpm install
```

### 2. Environment Setup

Create a `.env` file in the server directory:

```env
DATABASE_URL="file:./dev.db"
SESSION_SECRET="your-super-secure-session-secret-change-this-in-production"
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Seed the database with test data
pnpm seed
```

### 4. Start Development Server

```bash
pnpm dev
```

The server will start on `http://localhost:5000`

## 🔑 Test Credentials

After seeding, you can use these test accounts:

| Role       | Email                 | Password    |
| ---------- | --------------------- | ----------- |
| Admin      | admin@roster.com      | password123 |
| Supervisor | supervisor@roster.com | password123 |
| Staff      | alice@roster.com      | password123 |
| Staff      | bob@roster.com        | password123 |
| Staff      | carol@roster.com      | password123 |

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### 🔐 Authentication

#### POST `/auth/login`

Login user and create session

**Request:**

```json
{
  "email": "admin@roster.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@roster.com",
    "role": "ADMIN"
  },
  "message": "Login successful"
}
```

#### POST `/auth/logout`

Logout user and destroy session

#### GET `/auth/me`

Get current user information

### 👥 Users

#### GET `/users`

Get all users (Admin/Supervisor only)

#### GET `/users/:id`

Get user by ID

#### POST `/users`

Create new user (Admin only)

**Request:**

```json
{
  "name": "New User",
  "email": "newuser@roster.com",
  "password": "password123",
  "role": "STAFF"
}
```

#### PUT `/users/:id`

Update user

#### DELETE `/users/:id`

Delete user (Admin only)

### 📅 Duty Rosters

#### GET `/dutyrosters`

Get all duty rosters

**Query Parameters:**

- `date` - Filter by date (YYYY-MM-DD)
- `shift` - Filter by shift (MORNING, EVENING, NIGHT)

#### GET `/dutyrosters/:id`

Get duty roster by ID

#### POST `/dutyrosters`

Create new duty roster (Supervisor/Admin only)

**Request:**

```json
{
  "date": "2025-09-20",
  "shift": "MORNING"
}
```

#### PUT `/dutyrosters/:id`

Update duty roster

#### DELETE `/dutyrosters/:id`

Delete duty roster

### 📋 Assignments

#### GET `/assignments`

Get all assignments

**Query Parameters:**

- `userId` - Filter by user ID
- `dutyRosterId` - Filter by duty roster ID

#### GET `/assignments/:id`

Get assignment by ID

#### POST `/assignments`

Create new assignment

**Request:**

```json
{
  "dutyRosterId": "uuid",
  "userId": "uuid"
}
```

#### DELETE `/assignments/:id`

Delete assignment

### 🔔 Notifications

#### GET `/notifications`

Get all notifications (Admin only)

#### GET `/notifications/user/:userId`

Get notifications for specific user

#### POST `/notifications`

Create new notification

**Request:**

```json
{
  "userId": "uuid",
  "title": "Test Notification",
  "message": "This is a test message",
  "type": "SYSTEM_ANNOUNCEMENT",
  "metadata": "{\"key\": \"value\"}"
}
```

#### PATCH `/notifications/:id/read`

Mark notification as read

#### DELETE `/notifications/:id`

Delete notification

## 🔌 WebSocket Events

### Connection

```javascript
const socket = io("http://localhost:5000");

// Join user room for notifications
socket.emit("join", userId);

// Listen for real-time notifications
socket.on("notification", (notification) => {
  console.log("New notification:", notification);
});
```

### Events

- `join` - Join user-specific room
- `notification` - Receive real-time notifications
- `joined` - Confirmation of room join
- `error` - Connection/room errors

## 📊 Data Models

### User Roles

- `ADMIN` - Full system access
- `SUPERVISOR` - Manage rosters and assignments
- `STAFF` - View own assignments

### Shifts

- `MORNING` - Morning shift
- `EVENING` - Evening shift
- `NIGHT` - Night shift

### Notification Types

- `ASSIGNMENT_CREATED`
- `ASSIGNMENT_UPDATED`
- `ASSIGNMENT_DELETED`
- `DUTY_ROSTER_CREATED`
- `DUTY_ROSTER_UPDATED`
- `SYSTEM_ANNOUNCEMENT`
- `REMINDER`

## 📂 Project Structure

```
src/
├── index.ts                    # Main application entry point
├── responses.ts               # Standardized API responses
├── @types/                    # TypeScript type definitions
│   ├── express/
│   └── express-session/
├── controllers/               # Request handlers
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── dutyroster.controller.ts
│   ├── assignment.controller.ts
│   └── notification.controller.ts
├── services/                  # Business logic
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── dutyroster.service.ts
│   ├── assignment.service.ts
│   ├── notification.service.ts
│   └── jwt.service.ts
├── middleware/                # Express middleware
│   ├── authenticate.ts
│   ├── errorHandler.ts
│   ├── requestLogger.ts
│   ├── uploadHandler.ts
│   └── validator.ts
├── routes/                    # API routes
│   ├── auth.route.ts
│   ├── user.route.ts
│   ├── dutyroster.route.ts
│   ├── assignment.route.ts
│   ├── notification.route.ts
│   └── upload.route.ts
├── handlers/                  # Socket.IO handlers
│   └── socket.handler.ts
├── emitters/                  # Event emitters
│   └── notification.emitter.ts
├── utils/                     # Utility functions
│   └── prisma.ts
└── validators/                # Request validation schemas
    └── index.ts

prisma/
├── schema.prisma             # Database schema
├── migrations/               # Database migrations
└── seed.ts                   # Database seeding

```

## 🚀 Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reload
pnpm build        # Build for production
pnpm start        # Start production server

# Database
pnpm prisma:generate  # Generate Prisma client
pnpm prisma:migrate   # Run database migrations
pnpm prisma:studio    # Open Prisma Studio GUI
pnpm seed            # Seed database with test data

# Testing
pnpm test        # Run tests (not implemented yet)
```

## 🐳 Docker Deployment

### Development

```bash
docker build -t roster-server:dev .
docker run -p 5000:5000 --env-file .env roster-server:dev
```

### Production

```bash
docker build -t roster-server:prod .
docker run -d \
  --name roster-server \
  -p 5000:5000 \
  --env-file .env.production \
  roster-server:prod
```

## 🔧 Configuration

### Environment Variables

| Variable         | Description               | Default           |
| ---------------- | ------------------------- | ----------------- |
| `DATABASE_URL`   | SQLite database file path | `"file:./dev.db"` |
| `SESSION_SECRET` | Session encryption secret | `required`        |
| `PORT`           | Server port               | `5000`            |
| `NODE_ENV`       | Environment mode          | `development`     |

### CORS Configuration

Currently configured for frontend development:

```typescript
cors({
  origin: ["http://localhost:5173"],
  credentials: true,
});
```

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing protection
- **bcrypt** - Password hashing
- **Session-based authentication** - Secure session management
- **Role-based authorization** - Endpoint protection based on user roles
- **Input validation** - Express Validator for request validation

## 🚧 Development

### Adding New Features

1. **Database Changes**: Update `prisma/schema.prisma` and run migrations
2. **API Endpoints**: Add routes, controllers, and services
3. **Real-time Features**: Update socket handlers and emitters
4. **Validation**: Add validators for new endpoints

### Testing

Currently using manual testing. Recommended testing tools:

- **Unit Tests**: Jest + Supertest
- **API Testing**: Postman collections
- **Socket Testing**: Socket.IO client tools

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions, please create an issue in the repository.

---

**Built with ❤️ for efficient duty roster management**
