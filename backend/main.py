from dotenv import load_dotenv
from pydantic import BaseModel
from google import genai
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Saheli backend is live!"}


@app.get("/opportunities")
def get_opportunities():
    return [
        {"id":1, "title":"Bridal Mehndi", "category":"Mehndi", "dist":"0.5 km", "time":"Kal Subah", "pay":"₹1,800", "urgent": False},
        {"id":2, "title":"Blouse Silai", "category":"Tailoring", "dist":"1.2 km", "time":"2 din mein", "pay":"₹600", "urgent": False},
        {"id":3, "title":"Pooja Khana Banana", "category":"Cooking", "dist":"0.8 km", "time":"Aaj Shaam", "pay":"₹800", "urgent": True},
        {"id":4, "title":"Bachche ki Padhai", "category":"Tuition", "dist":"2 km", "time":"Har roz", "pay":"₹500/din", "urgent": False},
        {"id":5, "title":"Dulhan Makeup", "category":"Beautician", "dist":"1 km", "time":"Kal", "pay":"₹2,000", "urgent": True},
    ]


@app.get("/dashboard")
def get_dashboard():
    return {
        "name": "Shanti",
        "rating": 4.8,
        "jobs_completed": 128,
        "today_earnings": 1240,
        "week_earnings": 8450,
        "weekly_progress": 68
    }


class ChatRequest(BaseModel):
    messages: list
    system: str = ""


@app.post("/api/chat")
async def chat(request: ChatRequest):

    conversation = request.system + "\n\n"

    for msg in request.messages:
        conversation += f"{msg['role']}: {msg['content']}\n"

    print("API Key:", os.getenv("GEMINI_API_KEY")[:10])
    print("Sending request...")

    try:
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=conversation
        )

        return {
            "reply": response.text
        }

    except Exception as e:
        print("Gemini Error:", e)
        return {
            "reply": str(e)
  
        }
@app.get("/orders")
def get_orders():
    return [
        {
            "id": 1,
            "customer": "Anita Sharma",
            "service": "Bridal Mehndi",
            "date": "22 July",
            "status": "Upcoming",
            "amount": "₹1800"
        },
        {
            "id": 2,
            "customer": "Pooja Verma",
            "service": "Cooking",
            "date": "20 July",
            "status": "Completed",
            "amount": "₹800"
        },
        {
            "id": 3,
            "customer": "Neha Gupta",
            "service": "Blouse Stitching",
            "date": "23 July",
            "status": "Pending",
            "amount": "₹600"
        }
    ]
@app.get("/orders/{order_id}")
def get_order(order_id: int):
    return {
        "id": order_id,
        "customer": "Anita Sharma",
        "service": "Bridal Mehndi",
        "phone": "9876543210",
        "address": "Raipur",
        "date": "22 July",
        "time": "10:00 AM",
        "amount": "₹1800",
        "status": "Upcoming",
        "description": "Bridal mehndi for wedding ceremony."
    }
@app.get("/earnings")
def get_earnings():
    return {
        "today": 1240,
        "week": 8450,
        "month": 28600,
        "pending": 2400,
        "history": [
            {
                "id": 1,
                "title": "Bridal Mehndi",
                "amount": "₹1800",
                "date": "22 July"
            },
            {
                "id": 2,
                "title": "Cooking",
                "amount": "₹800",
                "date": "20 July"
            },
            {
                "id": 3,
                "title": "Blouse Stitching",
                "amount": "₹600",
                "date": "18 July"
            }
        ]
    }
@app.get("/profile")
def get_profile():
    return {
        "name": "Shanti Devi",
        "location": "Rampur, Madhya Pradesh",
        "rating": 4.8,
        "reviews": 34,
        "jobs_completed": 128,
        "month_income": 12450,
        "phone": "+91 9876543210",
        "language": "Hindi",
        "skills": [
            "Tailoring",
            "Mehndi",
            "Cooking"
        ],
        "work_type": "Ghar se",
        "travel_distance": "5 km tak",
        "available_time": "Subah 9 – Shaam 6",
        "about": "Mujhe 8 saal ka anubhav hai silai aur mehndi mein. Maine apne gaon ki bahut saari shadiyon mein kaam kiya hai.",
        "monthly_earnings": [
            {
                "month": "April",
                "amount": 9200,
                "current": False
            },
            {
                "month": "May",
                "amount": 11050,
                "current": False
            },
            {
                "month": "June",
                "amount": 12450,
                "current": True
            }
        ],
        "total_earnings": 32700
    }