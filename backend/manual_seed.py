from app.database import engine, Base, SessionLocal
from app.main import seed_sample_data
from app.models import User, ProjectInvest

def manual_seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
    
    print("Seeding data...")
    try:
        seed_sample_data()
        print("Seeding complete.")
    except Exception as e:
        print(f"Error seeding data: {e}")

    # Verify
    db = SessionLocal()
    user = db.query(User).filter(User.username == "superadmin").first()
    if user:
        print("VERIFIED: Superadmin user exists.")
    else:
        print("ERROR: Superadmin user NOT found.")
    db.close()

if __name__ == "__main__":
    manual_seed()
