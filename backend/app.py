from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from generate_media import generate_desc, generate_image_url

app = FastAPI()

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
    print(transcript.transcript)
    image_desc = generate_desc(transcript.transcript)
    print("Image description is ", image_desc)
    image_url = generate_image_url(image_desc)
    print("Image url is ", image_url)
    return {"message": image_url}

@app.post("/titleScreen")
async def create_title_screen(transcript: TranscriptModel):
    image_url = generate_image_url(transcript.transcript)
    print("Title screen url is : ", image_url)
    return {"message": image_url}
