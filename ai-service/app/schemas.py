from pydantic import BaseModel
from typing import List

class Resume(BaseModel):
    id: int
    candidateEmail: str
    skills: List[str]

class Job(BaseModel):
    id: int
    requiredSkills: List[str]

class MatchRequest(BaseModel):
    resumes: List[Resume]
    job: Job
