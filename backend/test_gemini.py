import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

key = os.getenv("GEMINI_API_KEY")

print("Loaded key:", repr(key))

genai.configure(api_key=key)

model = genai.GenerativeModel("gemini-2.5-flash")

response = model.generate_content(
    "Say hello."
)

print(response.text)