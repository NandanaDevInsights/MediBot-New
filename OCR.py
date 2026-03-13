import os
import requests
from dotenv import load_dotenv
from flask import request
from twilio.twiml.messaging_response import MessagingResponse

# Load environment variables
load_dotenv()

from app import app  # Import the main app to avoid port conflicts
from db_connect import get_connection

# ----------------------------
# DATABASE INIT
# ----------------------------
def init_db():
    """Ensure the prescriptions table exists and has necessary columns."""
    try:
        conn = get_connection()
        cursor = conn.cursor()
        
        # 1. Create table if not exists
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS prescriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                mobile_number VARCHAR(20),
                image_url TEXT,
                extracted_text TEXT,
                test_type VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # 2. Check and add columns if missing (Fix for existing tables)
        expected_columns = {
            "mobile_number": "VARCHAR(20)",
            "image_url": "TEXT",
            "extracted_text": "TEXT",
            "test_type": "VARCHAR(100)"
        }

        for col, dtype in expected_columns.items():
            try:
                cursor.execute(f"SELECT {col} FROM prescriptions LIMIT 1")
                cursor.fetchall()
            except Exception:
                print(f"⚠️ Adding missing column: {col}")
                # Reset cursor or use a clean one if the previous execute failed transactionally?
                # In loose MySQL drivers this is fine, but rigorous ones might need a commit/rollback.
                # However, for this simplified script:
                try:
                    cursor.execute(f"ALTER TABLE prescriptions ADD COLUMN {col} {dtype}")
                except Exception as alter_err:
                     print(f"Failed to add {col}: {alter_err}")

        conn.commit()
        cursor.close()
        conn.close()
        print("✅ Database initialized: 'prescriptions' table ready.")
    except Exception as e:
        print(f"⚠️ Database Initialization Failed: {e}")

# Run DB init on startup
init_db()

# ----------------------------
# WEBHOOK ROUTE
# ----------------------------
@app.route("/webhook/whatsapp", methods=["POST"])
def whatsapp_webhook():
    print("✅ Webhook HIT - Processing Prescription")
    
    resp = MessagingResponse()

    # 1️⃣ Check if image is sent
    num_media = int(request.form.get("NumMedia", 0))
    sender_number = request.form.get("From", "Unknown")

    if num_media == 0:
        resp.message("❌ Please send a prescription image.")
        return str(resp)

    # 2️⃣ Get image URL
    media_url = request.form.get("MediaUrl0")
    print("📸 Image URL:", media_url)

    try:
        # 3️⃣ Download image
        image_path = "prescription.jpg"
        
        # Twilio User-Agent / Auth handling
        print(f"🔑 Downloading image from: {media_url}")
        
        # Credentials (loaded from .env)
        TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
        TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
        
        headers = {'User-Agent': 'TwilioBot'}
        download_resp = requests.get(
            media_url,
            auth=(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN),
            headers=headers
        )
        
        if download_resp.status_code in [401, 403]:
            # Fallback for protected content
            download_resp = requests.get(media_url, headers=headers)
        
        if download_resp.status_code == 200:
            with open(image_path, "wb") as f:
                f.write(download_resp.content)
            print("✅ Image downloaded successfully.")
        else:
            print(f"❌ Failed to download. Status: {download_resp.status_code}")
            resp.message("❌ Could not download image. Please check settings.")
            return str(resp)

        # 4️⃣ OCR.Space API (Free, No Billing)
        print("🤖 Sending to OCR.Space...")
        
        ocr_response = requests.post(
            'https://api.ocr.space/parse/image',
            files={image_path: open(image_path, 'rb')},
            data={'apikey': 'helloworld', 'language': 'eng', 'OCREngine': 2}
        )
        
        result_json = ocr_response.json()
        
        if result_json.get('IsErroredOnProcessing'):
            resp.message("❌ Could not read text (OCR Error).")
            return str(resp)
            
        parsed_results = result_json.get('ParsedResults')
        if not parsed_results or not parsed_results[0].get('ParsedText'):
             resp.message("❌ No legible text found in image.")
             return str(resp)

        extracted_text = parsed_results[0]['ParsedText'].lower()
        print("📝 OCR Text Snippet:", extracted_text[:50].replace('\n', ' '))

        # 5️⃣ Detect test type
        test_type = "General Lab Test"
        if "blood" in extracted_text or "cbc" in extracted_text: test_type = "Blood Test"
        elif "urine" in extracted_text: test_type = "Urine Test"
        elif "thyroid" in extracted_text or "tsh" in extracted_text: test_type = "Thyroid Test"
        elif "sugar" in extracted_text or "glucose" in extracted_text: test_type = "Diabetes/Sugar Test"
        elif "cholesterol" in extracted_text or "lipid" in extracted_text: test_type = "Lipid Profile"

        print(f"🔬 Identified Test: {test_type}")

        # 6️⃣ Save to Database
        try:
            conn = get_connection()
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO prescriptions (mobile_number, image_url, extracted_text, test_type) VALUES (%s, %s, %s, %s)",
                (sender_number, media_url, extracted_text, test_type)
            )
            conn.commit()
            cursor.close()
            conn.close()
            print("💾 Prescription saved to DB.")
        except Exception as db_err:
            print(f"⚠️ DB Save Failed: {db_err}")

        # 7️⃣ Return Login Link
        # Responding with the exact requested URL
        website_link = "http://127.0.0.1:5173/login"
        resp.message(
            f"✅ *Prescription Processed!*\n"
            f"🔬 *Test:* {test_type}\n"
            f"💾 *Saved to Records*\n\n"
            f"Login here:\n"
            f"{website_link}"
        )

    except Exception as e:
        import traceback
        traceback.print_exc()
        resp.message("❌ Internal server error.")

    return str(resp)

@app.route("/", methods=["GET", "POST"])
def health_check():
    """
    Simple health check route to verify the server is running and accessible.
    """
    return "✅ Backend is RUNNING! If you see this, the URL is correct."

if __name__ == "__main__":
    # Run the IMPORTED app (which contains auth + OCR)
    print("🚀 Starting Combined Server (Auth + OCR) on port 5000...")
    app.run(host="0.0.0.0", port=5000, debug=True)

