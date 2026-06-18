# Tiffin Management System

A comprehensive web-based platform for managing tiffin (meal box) services for students. This full-stack application streamlines meal ordering, attendance tracking, menu management, and admin dashboards for efficient tiffin service operations.

## 🎯 Features

### Student Features
- **User Authentication**: Secure registration and login with JWT-based authentication
- **Order Management**: Place, track, and manage tiffin orders
- **Menu Browsing**: View available menus and meal options
- **Attendance Tracking**: Access attendance records
- **Diet Preferences**: Specify dietary preferences (Veg, Non-Veg, Vegan)
- **Personal Dashboard**: View order history and account details

### Admin Features
- **Admin Dashboard**: Comprehensive overview of system metrics
- **Menu Management**: Create, update, and manage meal menus
- **Order Management**: Monitor and manage all student orders
- **Student Management**: View and manage student profiles
- **Attendance Management**: Track and manage attendance records
- **User Management**: Manage user accounts and permissions

## 🏗️ Tech Stack

### Backend
- **Framework**: Spring Boot 3.3.5
- **Language**: Java 17
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: Hibernate (Spring Data JPA)
- **Build Tool**: Maven
- **Security**: Spring Security with CORS configuration

### Frontend
- **Framework**: React 18.3.1
- **Build Tool**: Vite 5.4.10
- **Routing**: React Router 6.28.0
- **HTTP Client**: Axios 1.7.7
- **Styling**: CSS3
- **Development Server**: Node.js

### Database
- **DBMS**: MySQL 8.0+
- **Charset**: UTF-8 (utf8mb4)
- **Collation**: utf8mb4_unicode_ci

## 📁 Project Structure

```
Tiffin-Management-System/
├── backend/                           # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/tiffin/management/
│   │   │   │   ├── controller/       # REST API endpoints
│   │   │   │   ├── service/          # Business logic
│   │   │   │   ├── repository/       # Data access layer
│   │   │   │   ├── entity/           # JPA entities
│   │   │   │   ├── dto/              # Data transfer objects
│   │   │   │   ├── exception/        # Custom exceptions
│   │   │   │   ├── security/         # Security configurations
│   │   │   │   ├── config/           # Application configuration
│   │   │   │   └── enums/            # Enumeration classes
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml                        # Maven dependencies
│   └── target/                        # Compiled output
│
├── frontend/                          # React Frontend
│   ├── src/
│   │   ├── components/               # Reusable React components
│   │   │   ├── common/              # Common components (Loader, Toast, etc.)
│   │   │   ├── layout/              # Layout components
│   │   │   └── ui/                  # UI components
│   │   ├── pages/                   # Page components
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── auth/                # Authentication pages
│   │   │   └── student/             # Student pages
│   │   ├── services/
│   │   │   ├── api/                 # API service modules
│   │   │   └── apiClient.js         # Axios configuration
│   │   ├── context/                 # React Context API
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── routes/                  # Route configuration
│   │   ├── constants/               # Application constants
│   │   ├── utils/                   # Utility functions
│   │   ├── assets/
│   │   │   └── styles/              # CSS stylesheets
│   │   ├── App.jsx                  # Main App component
│   │   └── main.jsx                 # React entry point
│   ├── public/                       # Static assets
│   ├── package.json                  # NPM dependencies
│   ├── vite.config.js               # Vite configuration
│   └── index.html                   # HTML template
│
├── database/
│   └── schema.sql                   # MySQL database schema
│
├── docs/
│   └── postman-collection.json      # API documentation (Postman)
│
├── uploads/
│   └── aadhaar/                     # Aadhaar document uploads
│
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Java**: JDK 17 or higher
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **MySQL**: v8.0 or higher
- **Git**: For version control

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd Tiffin-Management-System
```

#### 2. Database Setup

1. Open MySQL command line or MySQL Workbench
2. Execute the schema script:

```bash
mysql -u root -p < database/schema.sql
```

Or if using MySQL Workbench:
- Open `database/schema.sql`
- Execute the script

**Default credentials** (update in `application.properties` before deployment):
- Username: `root`
- Password: `hellodeb@2024`
- Database: `tiffin_management_db`

#### 3. Backend Setup

```bash
cd backend

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080/api`

#### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔧 Configuration

### Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
# Server
server.port=8080
server.servlet.context-path=/api

# Database
spring.datasource.url=jdbc:mysql://localhost:3306/tiffin_management_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
app.jwt.secret=your_jwt_secret
app.jwt.expiration=86400000  # 24 hours in milliseconds
```

### Frontend Configuration

Update `frontend/src/services/api/apiClient.js` with your backend URL:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## 📚 Database Schema

### Main Tables

- **users**: User accounts with roles (ADMIN, STUDENT)
- **student_profiles**: Extended student information (enrollment, hostel, Aadhaar, diet preference)
- **menus**: Available meal menus with pricing
- **tiffin_orders**: Student meal orders with status tracking
- **attendance**: Attendance records for students

All tables include audit fields:
- `created_at`: Record creation timestamp
- `updated_at`: Last update timestamp

## 🔐 Authentication & Authorization

- JWT-based authentication for secure API access
- Role-based access control (RBAC):
  - **ADMIN**: Full system access
  - **STUDENT**: Limited access to own data
- Password hashing using Spring Security

## 📡 API Documentation

API endpoints are documented in `docs/postman-collection.json`. Import this file into Postman to explore all available endpoints.

### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| GET | `/student/dashboard` | Student dashboard data |
| GET | `/menu` | Get all menus |
| POST | `/order` | Create new order |
| GET | `/order` | Get student orders |
| GET | `/admin/dashboard` | Admin dashboard data |
| GET | `/attendance` | Get attendance records |

## 🛠️ Build & Deployment

### Backend Build

```bash
cd backend
mvn clean package -DskipTests
```

WAR/JAR file will be generated in `target/` directory.

### Frontend Build

```bash
cd frontend
npm run build
```

Distribution files will be in `frontend/dist/` directory.

## 🧪 Testing

### Backend Unit Tests

```bash
cd backend
mvn test
```

### Frontend Linting

```bash
cd frontend
npm run lint
```

## 📝 Development Workflow

1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add your feature"
   ```

3. Push and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🐛 Troubleshooting

### Backend Issues

**Issue**: MySQL connection error
- **Solution**: Verify MySQL is running and credentials in `application.properties` are correct

**Issue**: Port 8080 already in use
- **Solution**: Change `server.port` in `application.properties` or kill process using port 8080

### Frontend Issues

**Issue**: npm install fails
- **Solution**: Clear npm cache and try again:
  ```bash
  npm cache clean --force
  npm install
  ```

**Issue**: Vite port 5173 already in use
- **Solution**: Specify a different port:
  ```bash
  npm run dev -- --port 3000
  ```

## 📦 Dependencies

### Backend Key Dependencies
- Spring Boot Web Starter
- Spring Data JPA
- Spring Security
- MySQL Connector
- JWT (JJWT 0.12.6)

### Frontend Key Dependencies
- React Router DOM (Routing)
- Axios (HTTP Client)
- Vite (Build tool)

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues, questions, or contributions, please contact the development team.

---