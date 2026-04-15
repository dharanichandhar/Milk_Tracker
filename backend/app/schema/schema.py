from pydantic import BaseModel


class CustomerSingup(BaseModel):
    name: str
    email: str
    password: str


class CustomerLogin(BaseModel):
    email: str
    password: str


class VendorSingup(BaseModel):
    name: str
    email: str
    password: str
    image_url: str


class VendorLogin(BaseModel):
    email: str
    password: str


class SubscriptionCreate(BaseModel):
    vendor_id: int


class SubscribeRequest(BaseModel):
    vendor_id: int
