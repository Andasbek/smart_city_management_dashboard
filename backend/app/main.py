from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import ai_chat, ai_insights, alerts, dashboard, ecology, scenarios, transport

app = FastAPI(
    title="Smart City Management Dashboard MVP",
    description="Backend API for the demonstration of Smart City Management",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])
app.include_router(transport.router, prefix="/api/transport", tags=["Transport"])
app.include_router(ecology.router, prefix="/api/ecology", tags=["Ecology"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["Scenarios"])
app.include_router(ai_insights.router, prefix="/api/ai-insights", tags=["AI Insights"])
app.include_router(ai_chat.router, prefix="/api/ai-chat", tags=["AI Chat"])

@app.get("/")
def root():
    return {"message": "Smart City Management API is running. Check /docs for documentation."}
