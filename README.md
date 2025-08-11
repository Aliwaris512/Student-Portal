# Student Portal - Full Stack Web Application

A comprehensive student management system built with FastAPI (backend) and React (frontend) featuring role-based access control for students, teachers, and administrators.

## 🚀 Features

### For Students
- View enrolled courses and grades
- Access assignments and submit work
- Check class schedule and attendance
- View financial information and fees
- Access library resources
- Update profile information

### For Teachers
- Manage assigned courses
- Grade student assignments
- View class rosters and attendance
- Create and manage assignments
- Access teaching dashboard with statistics

### For Administrators
- Complete user management (students, teachers, admins)
- Course creation and management
- Department management
- System monitoring and analytics
- Financial management
- Activity logs and audit trails

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Database
- **JWT** - Authentication
- **Pydantic** - Data validation
- **WebSockets** - Real-time notifications

### Frontend
- **React** - JavaScript library for UI
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Router** - Navigation
- **Chart.js** - Data visualization

## 📦 Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd fastapi-student_portal
pip install -r requirements.txt
python init_db.py
python -m uvicorn main.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
```bash
npm install
npm start
```

## 🔐 Default Login Credentials

### Admin
- Email: `admin@university.edu`
- Password: `admin123`

### Teacher
- Email: `teacher@university.edu`
- Password: `teacher123`

### Student
- Email: `student@university.edu`
- Password: `student123`

## 📁 Project Structure

```
Student Portal/
├── fastapi-student_portal/          # Backend API
│   ├── main/                        # Main application
│   ├── routers/                     # API endpoints
│   ├── models/                      # Database models
│   ├── schema/                      # Pydantic schemas
│   ├── authentication/              # JWT auth
│   ├── database/                    # Database configuration
│   └── requirements.txt
├── src/                            # React frontend
│   ├── components/                  # Reusable components
│   ├── pages/                       # Page components
│   ├── contexts/                    # React contexts
│   └── App.js
├── public/                         # Static files
└── package.json
```

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/user/login` - User login
- `POST /api/v1/user/logout` - User logout

### Student Endpoints
- `GET /api/v1/courses/my-courses` - Get enrolled courses
- `GET /api/v1/grades/my-grades` - Get grades
- `GET /api/v1/assignments/my-assignments` - Get assignments

### Teacher Endpoints
- `GET /api/v1/teacher/dashboard` - Teacher dashboard
- `GET /api/v1/teacher/courses` - Teacher's courses
- `POST /api/v1/assignments/create` - Create assignment

### Admin Endpoints
- `GET /api/v1/admin/dashboard/stats` - Admin statistics
- `GET /api/v1/admin/users` - User management
- `POST /api/v1/admin/courses` - Course management

## 🔧 Configuration

The application uses environment variables for configuration. Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue on GitHub.
