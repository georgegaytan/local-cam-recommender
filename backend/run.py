import uvicorn
import os
import sys

if __name__ == "__main__":
    # Freeze support for multiprocessing if needed (not strictly needed for uvicorn basic, but good practice)
    # multiprocessing.freeze_support()
    
    # Determine port, default to 8000
    port = int(os.environ.get("PORT", 8000))
    
    # Run uvicorn programmatically
    # We use "app.main:app" string if reloading, but for frozen app we pass the app object directly or import it
    # Passing import string works best if package is structured, but for onefile, passing app object is safer
    # However, uvicorn.run wants an import string for workers > 1. We will use workers=1.
    
    # Needs to find the app module.
    # When bundled, we need to make sure 'app' is in path.
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

    # Import the app object
    try:
        from app.main import app
        uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
    except Exception as e:
        print(f"Error starting server: {e}")
        input("Press Enter to exit...") # Keep window open on error
