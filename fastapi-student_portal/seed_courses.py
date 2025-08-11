# Script to seed sample courses into the database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import model

DB_PATH = 'sqlite:///student__portal.db'
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

courses = [
    {"course_name": "Mathematics 101", "instructor": "Dr. Smith", "credit_hrs": 3, "fee": 1000.0},
    {"course_name": "Physics 201", "instructor": "Dr. Johnson", "credit_hrs": 4, "fee": 1200.0},
    {"course_name": "Chemistry 301", "instructor": "Dr. Lee", "credit_hrs": 3, "fee": 1100.0}
]

for c in courses:
    existing = session.query(model.Courses).filter(model.Courses.course_name == c["course_name"]).first()
    if not existing:
        new_course = model.Courses(**c)
        session.add(new_course)
        print(f"Added course: {c['course_name']}")
    else:
        print(f"Course already exists: {c['course_name']}")
session.commit()
session.close()
print("Course seeding complete.")
