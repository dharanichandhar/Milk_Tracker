import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name="dx5nn74ui",
    api_key="577691156483744",
    api_secret="NocpaqWqVQEMlvpWecRkW4T7csA"
)

def upload_to_cloudinary(file):
    result = cloudinary.uploader.upload(file.file)
    return result["secure_url"]