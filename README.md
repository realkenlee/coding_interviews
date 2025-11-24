# Python Interview Prep

A minimalist mobile web app (PWA) for practicing timed Python coding interviews on iPhone.

## Features

- **Timer**: Start/Pause/Reset with Page Visibility API support (tracks time even when tab is inactive)
- **Code Editor**: CodeMirror 6 with Python syntax highlighting and mobile-friendly keyboard toolbar
- **Question Input**: Paste any coding question and view it while coding
- **Code Execution**: Run Python code with 30s timeout via FastAPI backend
- **LocalStorage Persistence**: Your question and code survive page refreshes
- **PWA Support**: Add to Home Screen for native-like experience

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite for fast builds
- Tailwind CSS for mobile-first styling
- CodeMirror 6 for code editing
- vite-plugin-pwa for PWA manifest & service worker

**Backend:**
- FastAPI with Python 3.11+
- Single `/execute` endpoint for code execution
- 30s timeout, 10KB output limit

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`

## Configuration

Set the API URL via environment variable:

```bash
# In frontend/.env.local
VITE_API_URL=http://localhost:8000
```

For production, update this to your deployed backend URL.

## Deployment

### Backend (Railway/Render/Fly.io)

1. Deploy the `backend` folder
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Frontend (Vercel/Netlify)

1. Deploy the `frontend` folder
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set `VITE_API_URL` environment variable to your backend URL

## Mobile Optimizations

- Viewport meta prevents zoom on input focus
- Touch-friendly tap targets (44px minimum)
- Custom keyboard toolbar with Python shortcuts
- Service worker enables offline code editing
- iOS safe area padding support

## Project Structure

```
├── backend/
│   ├── main.py           # FastAPI server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timer.tsx
│   │   │   ├── Editor.tsx
│   │   │   ├── Collapsible.tsx
│   │   │   ├── KeyboardToolbar.tsx
│   │   │   └── Output.tsx
│   │   ├── hooks/
│   │   │   ├── useTimer.ts
│   │   │   └── useLocalStorage.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
└── README.md
```

## License

MIT
