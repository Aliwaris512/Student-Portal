from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import model
from authentication.oauth2 import get_current_user
from database.structure import get_db
from typing import List

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin"]
)

# Utility: ensure user is admin
def require_admin(user: model.Users):
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")

@router.get("/dashboard/stats")
def dashboard_stats(db: Session = Depends(get_db), current_user: model.Users = Depends(get_current_user())):
    require_admin(current_user)
    num_students = db.query(model.Users).filter(model.Users.role == "student").count()
    num_teachers = db.query(model.Users).filter(model.Users.role == "teacher").count()
    num_courses = db.query(model.Courses).count()
    num_events = db.query(model.Events).count()
    num_tasks = db.query(model.Tasks).count()
    return {
        "students": num_students,
        "teachers": num_teachers,
        "courses": num_courses,
        "events": num_events,
        "tasks": num_tasks
    }

@router.get("/users")
def list_users(db: Session = Depends(get_db), current_user: model.Users = Depends(get_current_user())):
    require_admin(current_user)
    users = db.query(model.Users).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role
        } for u in users
    ]

@router.get("/activity-logs")
def activity_logs(limit: int = 10, db: Session = Depends(get_db), current_user: model.Users = Depends(get_current_user())):
    require_admin(current_user)
    # Dummy logs for demo; in real app, fetch from logs table
    logs = [
        {"timestamp": "2025-08-07T12:00:00", "activity": "Admin logged in"},
        {"timestamp": "2025-08-07T12:05:00", "activity": "Viewed dashboard"},
        {"timestamp": "2025-08-07T12:10:00", "activity": "Checked users"}
    ]
    return logs[:limit]
