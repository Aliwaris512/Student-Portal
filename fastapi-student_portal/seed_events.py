# Script to seed sample events into the database
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import model
from datetime import date, timedelta

DB_PATH = 'sqlite:///student__portal.db'
engine = create_engine(DB_PATH, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
session = SessionLocal()

today = date.today()
events = [
    {"event_name": "Orientation Day", "event_date": today + timedelta(days=3), "event_location": "Auditorium"},
    {"event_name": "Science Fair", "event_date": today + timedelta(days=10), "event_location": "Main Hall"},
    {"event_name": "Sports Gala", "event_date": today + timedelta(days=20), "event_location": "Sports Ground"}
]

for e in events:
    existing = session.query(model.Events).filter(model.Events.event_name == e["event_name"]).first()
    if not existing:
        new_event = model.Events(**e)
        session.add(new_event)
        print(f"Added event: {e['event_name']}")
    else:
        print(f"Event already exists: {e['event_name']}")
session.commit()
session.close()
print("Event seeding complete.")
