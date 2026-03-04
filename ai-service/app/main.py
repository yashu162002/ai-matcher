from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import MatchRequest
from app.matcher import calculate_similarity

app = FastAPI(
    title="AI Matcher Service",
    description="Microservice for Resume-Job Matching",
    version="1.0.0"
)

# ✅ Enable CORS (important for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root route (fixes 404 issue)
@app.get("/")
def home():
    return {
        "status": "AI Service is running 🚀",
        "endpoint": "/match",
        "docs": "/docs"
    }


# ✅ Match Endpoint
@app.post("/match")
def match(request: MatchRequest):
    try:
        result = calculate_similarity(
            request.resumes,
            request.job
        )

        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during matching: {str(e)}"
        )
