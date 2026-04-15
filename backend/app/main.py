from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import customer, vendor, subscription


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(customer.router)
app.include_router(vendor.router)
app.include_router(subscription.router)
