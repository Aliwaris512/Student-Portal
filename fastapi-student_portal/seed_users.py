# Script to seed the database with default users (admin, teacher, student)
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import model
from hasher.hashing import Hash

DB_PATH = 'sqlite:///student__portal.db'
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

users = [
    {
        'name': 'Admin User',
        'role': 'admin',
        'email': 'admin@university.edu',
        'password': 'Admin@123!'
    },
    {
        'name': 'Teacher User',
        'role': 'teacher',
        'email': 'teacher@university.edu',
        'password': 'Teacher@123!'
    },
    {
        'name': 'Student User',
        'role': 'student',
        'email': 'student@university.edu',
        'password': 'Student@123!'
    },
]

for user in users:
    existing = session.query(model.Users).filter(model.Users.email == user['email']).first()
    if not existing:
        new_user = model.Users(
            name=user['name'],
            role=user['role'],
            email=user['email'],
            password=Hash.bcrypt(user['password'])
        )
        session.add(new_user)
        print(f"Added {user['role']} user: {user['email']}")
    else:
        print(f"User already exists: {user['email']}")
session.commit()
session.close()
print("User seeding complete.")
