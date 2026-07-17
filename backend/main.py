from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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