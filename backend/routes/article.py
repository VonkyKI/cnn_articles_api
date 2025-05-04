from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import DimArticle
from backend.schemas import ArticleSchema
from typing import List

router = APIRouter()


@router.get("/", response_model=List[ArticleSchema])
def get_opinions(db: Session = Depends(get_db)):
    return db.query(DimArticle).all()
