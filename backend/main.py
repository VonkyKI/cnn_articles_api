from fastapi import FastAPI
from backend.routes import article, opinion, person, topic, events

app = FastAPI()

app.include_router(article.router, prefix="/articles", tags=["Articles"])
app.include_router(opinion.router, prefix="/opinions", tags=["Opinions"])
app.include_router(person.router, prefix="/persons", tags=["Persons"])
app.include_router(topic.router, prefix="/topics", tags=["Topics"])
app.include_router(events.router, prefix="/events", tags=["Events"])
