# A-Level Certificate Verification System

A comprehensive full-stack web application for centralized A-Level certificate verification in Nigeria, built with React.js, Express.js, and SQLite.

## Features

### Core Functionality
- **Institution Registration & Approval**: Admin approval system for new institutions
- **Student Certificate Management**: Manual and CSV bulk upload of student records
- **Public Verification Portal**: Rate-limited public search for certificate verification
- **Admin Dashboard**: Institution management and verification logs
- **JWT Authentication**: Secure login and protected routes

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting on verification endpoint
- Input validation and sanitization
- File upload validation
- Comprehensive logging system

### Technical Features
- RESTful API architecture
- SQLite database with Sequelize ORM
- Responsive design with Tailwind CSS
- Modular component structure
- Error handling and validation
- Role-based access control

## Technology Stack

### Frontend
- React.js with TypeScript
- React Router for navigation
- Axios for API calls
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express.js
- SQLite database
- Sequelize ORM
- JWT for authentication
- Multer for file uploads
- Express-validator for validation
- Helmet for security headers

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the backend server:
```bash
npm run server
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Default Admin Account
- Email: admin@system.com
- Password: admin123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new institution
- `POST /api/auth/login` - Login

### Admin Routes
- `GET /api/admin/institutions` - Get all institutions
- `PUT /api/admin/institutions/:id/status` - Update institution status
- `GET /api/admin/logs` - Get verification logs

### Institution Routes
- `POST /api/students` - Add single student
- `POST /api/students/upload-csv` - Upload CSV file
- `GET /api/students` - Get institution's students

### Public Routes
- `POST /api/verification/verify` - Verify certificate

## CSV Upload Format

The CSV file should contain the following columns:
- fullName
- department
- certificateNumber
- yearOfEntry
- yearOfGraduation
- classOfDegree

## Database Schema

### Users Table
- id (Primary Key)
- email (Unique)
- password (Hashed)
- role (admin/institution)

### Institutions Table
- id (Primary Key)
- name
- email (Unique)
- accreditationId (Unique)
- address
- status (pending/approved/rejected)
- userId (Foreign Key)

### Students Table
- id (Primary Key)
- fullName
- department
- certificateNumber (Unique)
- yearOfEntry
- yearOfGraduation
- classOfDegree
- institutionId (Foreign Key)

### VerificationLogs Table
- id (Primary Key)
- certificateNumber
- ipAddress
- success (Boolean)
- timestamp

## Security Considerations

- All passwords are hashed using bcrypt
- JWT tokens expire after 24 hours
- Rate limiting prevents abuse of verification endpoint
- Input validation on all endpoints
- File upload restrictions (CSV only, 5MB limit)
- SQL injection prevention through Sequelize ORM
- XSS protection through input sanitization

## Future Enhancements

- QR code generation for certificates
- PDF certificate preview
- Email notifications for institution approvals
- Advanced search and filtering
- Certificate expiration management
- Mobile app version
- Multi-language support
- Analytics dashboard

## License

This project is licensed under the MIT License.