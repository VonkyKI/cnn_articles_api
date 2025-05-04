from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import dimEvents
from backend.schemas import EventSchema
from typing import List

router = APIRouter()


@router.get("/", response_model=List[EventSchema])
def get_opinions(db: Session = Depends(get_db)):
    return db.query(dimEvents).all()
