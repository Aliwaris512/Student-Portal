# Script to seed enrollments and tasks for testing
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import model
from datetime import date, timedelta

DB_PATH = 'sqlite:///student__portal.db'
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Get user and course IDs
student = session.query(model.Users).filter(model.Users.role == 'student').first()
courses = session.query(model.Courses).all()

# Enroll student in all courses
for course in courses:
    existing = session.query(model.Enrollment).filter(
        model.Enrollment.student_id == student.id,
        model.Enrollment.course == course.course_name
    ).first()
    if not existing:
        enrollment = model.Enrollment(
            student_id=student.id,
            student_name=student.name,
            course=course.course_name,
            course_id=course.id
        )
        session.add(enrollment)
        print(f"Enrolled {student.name} in {course.course_name}")
    else:
        print(f"Already enrolled in {course.course_name}")
session.commit()

# Add tasks to each course
for course in courses:
    for i in range(1, 3):
        task_name = f"Assignment {i} for {course.course_name}"
        existing = session.query(model.Tasks).filter(
            model.Tasks.task_name == task_name,
            model.Tasks.course_id == course.id
        ).first()
        if not existing:
            task = model.Tasks(
                task_name=task_name,
                task_description=f"Description for {task_name}",
                upload_date=date.today(),
                due_date=date.today() + timedelta(days=7*i),
                course_id=course.id
            )
            session.add(task)
            print(f"Added {task_name}")
        else:
            print(f"Task already exists: {task_name}")
session.commit()
session.close()
print("Enrollments and tasks seeding complete.")
