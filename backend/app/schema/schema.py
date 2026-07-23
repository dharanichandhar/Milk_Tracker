from pydantic import BaseModel


class CustomerSingup(BaseModel):
    name: str
    email: str
    password: str


class CustomerLogin(BaseModel):
    email: str
    password: str


class VendorLogin(BaseModel):
    email: str
    password: str
