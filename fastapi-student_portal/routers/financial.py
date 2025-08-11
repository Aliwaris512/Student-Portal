from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from models import model
from authentication.oauth2 import get_current_user
from database.structure import get_db
from typing import List, Optional

router = APIRouter(
    prefix="/api/v1/financial",
    tags=["Financial"]
)

# Student: Get their own financial summary
@router.get("/me")
def get_my_financial(current_user: model.Users = Depends(get_current_user()), db: Session = Depends(get_db)):
    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can view their financials.")
    # Example: get all charges/payments for this student
    charges = db.query(model.FinancialCharge).filter(model.FinancialCharge.student_id == current_user.id).all()
    payments = db.query(model.FinancialPayment).filter(model.FinancialPayment.student_id == current_user.id).all()
    aid = db.query(model.FinancialAid).filter(model.FinancialAid.student_id == current_user.id).all()
    balance = sum(c.amount for c in charges) - sum(p.amount for p in payments) - sum(a.amount for a in aid)
    return {
        "charges": [c.as_dict() for c in charges],
        "payments": [p.as_dict() for p in payments],
        "aid": [a.as_dict() for a in aid],
        "balance": balance
    }

# Admin: View any student's financials
@router.get("/student/{student_id}")
def get_student_financial(student_id: int, current_user: model.Users = Depends(get_current_user()), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    student = db.query(model.Users).filter(model.Users.id == student_id, model.Users.role == "student").first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found.")
    charges = db.query(model.FinancialCharge).filter(model.FinancialCharge.student_id == student.id).all()
    payments = db.query(model.FinancialPayment).filter(model.FinancialPayment.student_id == student.id).all()
    aid = db.query(model.FinancialAid).filter(model.FinancialAid.student_id == student.id).all()
    balance = sum(c.amount for c in charges) - sum(p.amount for p in payments) - sum(a.amount for a in aid)
    return {
        "student": {"id": student.id, "name": student.name, "email": student.email},
        "charges": [c.as_dict() for c in charges],
        "payments": [p.as_dict() for p in payments],
        "aid": [a.as_dict() for a in aid],
        "balance": balance
    }

# Admin: Post a charge/payment/aid for a student
@router.post("/student/{student_id}/charge")
def add_charge(student_id: int, charge: dict, current_user: model.Users = Depends(get_current_user()), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    new_charge = model.FinancialCharge(student_id=student_id, **charge)
    db.add(new_charge)
    db.commit()
    db.refresh(new_charge)
    return new_charge.as_dict()

@router.post("/student/{student_id}/payment")
def add_payment(student_id: int, payment: dict, current_user: model.Users = Depends(get_current_user()), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    new_payment = model.FinancialPayment(student_id=student_id, **payment)
    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment.as_dict()

@router.post("/student/{student_id}/aid")
def add_aid(student_id: int, aid: dict, current_user: model.Users = Depends(get_current_user()), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required.")
    new_aid = model.FinancialAid(student_id=student_id, **aid)
    db.add(new_aid)
    db.commit()
    db.refresh(new_aid)
    return new_aid.as_dict()

# Models must have as_dict() or use pydantic for serialization.
