from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import customer, vendor, subscription
from app.routes import milk_records, analytics, pricing
from app.scheduler import setup_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_scheduler()
    yield


app = FastAPI(lifespan=lifespan,)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer.router)
app.include_router(vendor.router)
app.include_router(subscription.router)
app.include_router(milk_records.router)
app.include_router(analytics.router)
app.include_router(pricing.router)


@app.get("/")
def root():
    return {"message": "Milk Tracker API", "version": "2.0.0"}



