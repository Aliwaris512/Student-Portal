# Script to update default user passwords to strong passwords in the student__portal.db
# Run this script once to set compliant passwords for admin, teacher, and student

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import model
from hasher.hashing import Hash

DB_PATH = 'sqlite:///student__portal.db'
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

# Update credentials
users_to_update = {
    'admin@university.edu': 'Admin@123!',
    'teacher@university.edu': 'Teacher@123!',
    'student@university.edu': 'Student@123!'
}

for email, new_password in users_to_update.items():
    user = session.query(model.Users).filter(model.Users.email == email).first()
    if user:
        user.password = Hash.bcrypt(new_password)
        print(f"Updated password for {email}")
    else:
        print(f"User not found: {email}")
session.commit()
session.close()
print("Password update complete.")
