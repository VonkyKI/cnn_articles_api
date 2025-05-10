from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class PersonSchema(BaseModel):
    person_id: int
    person_name: str
    political_party: Optional[str]
    class Config:
        orm_mode = True

class TopicSchema(BaseModel):
    topic_id: int
    topic_name: str
    class Config:
        orm_mode = True

class ArticleSchema(BaseModel):
    article_id: int
    title: str
    fk_topic_id: int
    url: Optional[str]
    article_date: Optional[datetime]
    class Config:
        orm_mode = True

class OpinionSchema(BaseModel):
    opinion_id: int
    fk_origin_article_id: int
    fk_person_id: int
    sentiment_score: Optional[float]
    relevancy_score: Optional[float]
    citation: Optional[str]
    created_at: Optional[datetime]
    is_selected: Optional[int]
    inconsistency_flag: Optional[int]
    inconsistency_with_id: Optional[int]
    opinion_hotness: Optional[float]
    class Config:
        orm_mode = True


class EventSchema(BaseModel):
    event_id: int
    fk_origin_article_id: int
    event_title: Optional[str]
    relevance_score: Optional[int]
    description: Optional[str]
    class Config:
        orm_mode = True


class ArticleCreateSchema(BaseModel):
    title: str
    url: HttpUrl
    article_date: datetime
    fk_topic_id: int