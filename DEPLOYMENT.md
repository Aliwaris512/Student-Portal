# Deployment Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd Student-portal
```

### 2. Backend Setup
```bash
cd fastapi-student_portal
pip install -r requirements.txt
python init_db.py
python -m uvicorn main.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
# In a new terminal, from the root directory
npm install
npm start
```

### 4. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Production Deployment

### Backend (FastAPI)
1. Use a production ASGI server like Gunicorn
2. Set up environment variables
3. Configure reverse proxy (Nginx)

### Frontend (React)
1. Build the application: `npm run build`
2. Serve static files with a web server
3. Configure API endpoint URLs

## Environment Variables

Create a `.env` file in the backend directory:
```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./student_portal.db
```

## Database Setup

The application uses SQLite by default. For production, consider using PostgreSQL or MySQL.

## Security Considerations

1. Change default passwords
2. Use HTTPS in production
3. Set up proper CORS configuration
4. Implement rate limiting
5. Regular security updates 