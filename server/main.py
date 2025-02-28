from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Import the routers

from routes.fraud_router import fraud_router


# Create the FastAPI application
app = FastAPI()

# Enable CORS for all origins, with all methods and headers
orgin = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=orgin,  # Allow all origins
    allow_credentials=True,  # Allow credentials
    allow_methods=["*"],  # Allow all HTTP methods
    
    allow_headers=["*"]  # Allow all HTTP headers
)
app.include_router(fraud_router)

# Run the application on port 8000
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)