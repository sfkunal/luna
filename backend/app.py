from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello():
    return {"message": "Hello from FastAPI!"}

class TranscriptModel(BaseModel):
    transcript: str

@app.post("/transcript")
async def receive_transcript(transcript: TranscriptModel):
    # Process the transcript here
    print(transcript.transcript)
    
    return {"message": "Transcript received successfully!"}