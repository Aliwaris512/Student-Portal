from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from authentication.oauth2 import get_current_user
from database.structure import get_db
from models import model
from schema import user_schema

router = APIRouter(
    prefix="/api/v1/profile",
    tags=["Profile"]
)

@router.get("/me")
def get_profile(current_user: model.Users = Depends(get_current_user())):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "major": getattr(current_user, "major", None),
        "year": getattr(current_user, "year", None),
        "phone": getattr(current_user, "phone", None),
        "address": getattr(current_user, "address", None)
    }

@router.put("/me")
def update_profile(
    updated: user_schema.UpdateProfile, 
    db: Session = Depends(get_db), 
    current_user: model.Users = Depends(get_current_user())
):
    try:
        user = db.query(model.Users).filter(model.Users.id == current_user.id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        # Update allowed fields
        if updated.name is not None:
            user.name = updated.name
        if updated.phone is not None:
            user.phone = updated.phone
        if updated.address is not None:
            user.address = updated.address
        if hasattr(user, "major") and updated.major is not None:
            user.major = updated.major
        if hasattr(user, "year") and updated.year is not None:
            user.year = updated.year
        db.commit()
        db.refresh(user)
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "major": getattr(user, "major", None),
            "year": getattr(user, "year", None),
            "phone": getattr(user, "phone", None),
            "address": getattr(user, "address", None)
        }
    except Exception as e:
        import traceback
        print("Profile update failed:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Profile update failed: {str(e)}")

