# Local CAM Recommender

A scaffolded system design learning project simulating an industrial edge software component. This project demonstrates local-first architecture, domain boundaries, and deterministic validation for manufacturing contexts.

## Goal

To understand architecture concepts relevant to industrial edge software, specifically:
- **Local-first backend service**: Functionality independent of cloud connectivity.
- **FastAPI design**: Clear domain boundaries and typed APIs.
- **SQLite embedded storage**: Simple, file-based persistence.
- **Deterministic validation**: Replayable and auditable decision logic.
- **Retrieval-based recommendations**: simulating ML inference.

## Features

- **Configuration Management**: Create and store machining configurations (Machine ID, Material, Tool Diameter, Feed Rate, Spindle Speed).
- **Validation Engine**: Deterministic rules to validate configurations (e.g., Feed Rate vs. Spindle Speed checks). Generates immutable validation hashes.
- **Recommendation Engine**: Retrieval-based system to suggest optimal configurations based on past successful jobs (similar material and tool diameter).
- **Plugin Simulator**: A Python script simulating a legacy CAM plugin (C++/C#) communicating with the modern backend via HTTP.
- **React Frontend**: A clean UI to interact with the system, visualize configurations, and test validation logic.
- **Electron App**: A standalone desktop application that automatically manages the backend server.

## Tech Stack

### Backend
- **Language**: Python 3.14
- **Framework**: FastAPI
- **Database**: SQLite (local file)
- **ORM**: SQLAlchemy
- **Validation**: Pydantic v2

### Frontend
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (clean and minimal)
- **Desktop Wrapper**: Electron

## Architecture

### Integration Boundary
The **Integration Boundary** is strictly enforced via the HTTP API. The "CAM Plugin" (simulated in `backend/plugin_simulator/`) communicates *only* via JSON/HTTP, never touching the database or internal logic directly.  This decouples external systems from the internal backend structure.

### ML Logic Isolation
The logic for recommendations is isolated within `backend/app/services/recommendation_service.py`. The API treats this as a black box, allowing for future upgrades to complex ML models (TensorFlow/PyTorch) without breaking the API contract.

### Validation Replayability
Every validation result includes a `validation_hash` computed from the input configuration. This ensures auditability and allows verification that a specific configuration produced a specific validation result at a point in time.

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
# source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. Documentation at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
The UI will be available at `http://localhost:5173`.

### 3. Desktop Application (Electron)

**Development Mode**:
Run both the React frontend and Python backend (from source) in a single command:
```bash
cd frontend
npm run electron:dev
```

**Build Standalone Executable**:
Package the application into a standalone Windows executable. This bundles the Python backend using PyInstaller, so the user doesn't need Python installed.
```bash
cd frontend
npm run electron:build
```
The output executable will be located at:
`frontend/release/win-unpacked/Local CAM Recommender.exe`

### 4. Running the Plugin Simulator

With the backend (or Electron app) running:

```bash
cd backend
python plugin_simulator/cam_plugin.py
```
This script acts as an external agent, showing how a third-party tool would interact with the local service.
