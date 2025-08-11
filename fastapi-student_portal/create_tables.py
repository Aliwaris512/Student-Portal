# Script to create all tables in the student__portal.db database using SQLAlchemy models
from models import model
from database.structure import engine, Base

if __name__ == "__main__":
    print("Creating all tables...")
    Base.metadata.create_all(engine)
    print("Tables created successfully.")
