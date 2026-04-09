from fastapi import APIRouter, HTTPException, UploadFile, Depends, Form, File , Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Vendor
from fastapi.responses import RedirectResponse
import os
import uuid

router = APIRouter(prefix="/api/vendors", tags=["vendors"])

@router.post("/create")
def create_vendor(
    name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    ext = image.filename.split(".")[-1].lower()

    if ext not in ["jpg", "jpeg", "png" , "webp", "gif"]:
        raise HTTPException(status_code=400, detail="Only jpg/png allowed")

    
    upload_dir = "app/uploads"
    os.makedirs(upload_dir, exist_ok=True)

    filename = f"{uuid.uuid4()}_{image.filename}"
    file_path = os.path.join(upload_dir, filename)

    with open(file_path, "wb") as f:
        f.write(image.file.read())

   
    image_url = f"/uploads/{filename}"

    vendor = Vendor(name=name, image_url=image_url)

    db.add(vendor)
    db.commit()

  
    return RedirectResponse(url="/admin?success=1&show=1", status_code=303)



@router.get("/particular")
def get_vendor(vendor_id: int = Query(...) , db : Session = Depends(get_db)):
    vendor = db.query(Vendor).filter(Vendor.id == vendor_id).first()
    if not vendor:
        raise HTTPException(status_code=404 , detail= "Vendor not found")
    return {"id" : vendor.id , "name" : vendor.name , "image_url" : vendor.image_url ,
             "customers" : [
                 {
                     "id" : c.id,
                     "name" : c.name
                 }
                 for c in vendor.customers
             ]
           }

@router.get("/all")
def get_all_vendors(db : Session = Depends(get_db)):
    vendors = db.query(Vendor).all()
    return [
        {
            "id" : v.id, "name" : v.name , "image_url" : v.image_url 
        }
        for v in vendors
    ]