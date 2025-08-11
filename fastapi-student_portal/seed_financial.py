from datetime import date
from models import model
from database.structure import engine, SessionLocal

def seed_financial():
    session = SessionLocal()
    # Find a student user
    student = session.query(model.Users).filter(model.Users.role == "student").first()
    if not student:
        print("No student found. Please seed users first.")
        return
    # Seed some charges
    charges = [
        model.FinancialCharge(student_id=student.id, description="Tuition - Full Time (12+ credits)", amount=6500.00, date=date(2024,1,15), category="tuition", status="charged"),
        model.FinancialCharge(student_id=student.id, description="Student Activity Fee", amount=150.00, date=date(2024,1,15), category="fees", status="charged"),
        model.FinancialCharge(student_id=student.id, description="Technology Fee", amount=200.00, date=date(2024,1,15), category="fees", status="charged"),
        model.FinancialCharge(student_id=student.id, description="Health Insurance", amount=1650.00, date=date(2024,1,15), category="insurance", status="charged"),
    ]
    session.add_all(charges)
    # Seed some payments
    payments = [
        model.FinancialPayment(student_id=student.id, description="Federal Pell Grant", amount=2000.00, date=date(2024,1,20), type="financial_aid", status="completed"),
        model.FinancialPayment(student_id=student.id, description="Federal Direct Loan", amount=3000.00, date=date(2024,1,25), type="loan", status="completed"),
        model.FinancialPayment(student_id=student.id, description="Credit Card Payment", amount=1500.00, date=date(2024,2,1), type="payment", status="completed"),
        model.FinancialPayment(student_id=student.id, description="Scholarship - Academic Excellence", amount=750.00, date=date(2024,2,5), type="scholarship", status="pending"),
    ]
    session.add_all(payments)
    # Seed some aid
    aid = [
        model.FinancialAid(student_id=student.id, description="Pell Grant", amount=2000.00, date=date(2024,1,20), source="grant"),
        model.FinancialAid(student_id=student.id, description="Direct Loan", amount=3000.00, date=date(2024,1,25), source="loan"),
        model.FinancialAid(student_id=student.id, description="Scholarship", amount=750.00, date=date(2024,2,5), source="scholarship"),
        model.FinancialAid(student_id=student.id, description="Work Study", amount=500.00, date=date(2024,1,28), source="work_study"),
    ]
    session.add_all(aid)
    session.commit()
    print("Seeded financial data for student:", student.email)
    session.close()

if __name__ == "__main__":
    seed_financial()
