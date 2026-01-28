- [ ] Create backend/main.py: FastAPI app setup, WS endpoints (/ws/device/{device_id}, /ws/admin), auth middleware.
- [ ] Create backend/models.py: SQLAlchemy models for users, devices, interaction_events.
- [ ] Create backend/routers/auth.py: Login, JWT token generation.
- [ ] Create backend/routers/devices.py: Device list, approval, status.
- [ ] Create backend/routers/events.py: REST API for events with filters.
- [ ] Create backend/requirements.txt: Dependencies (fastapi, uvicorn, sqlalchemy, psycopg2, websockets, etc.).
- [ ] Create backend/.env: Config for DB, secrets.
=======
## Backend (FastAPI)
- [x] Create backend/main.py: FastAPI app setup, WS endpoints (/ws/device/{device_id}, /ws/admin), auth middleware.
- [x] Create backend/models.py: SQLAlchemy models for users, devices, interaction_events.
- [x] Create backend/routers/auth.py: Login, JWT token generation.
- [ ] Create frontend/package.json: React setup with Tailwind.
- [ ] Create frontend/src/App.js: Main app with routing.
- [ ] Create frontend/src/components/Dashboard.js: Device list, status.
- [ ] Create frontend/src/components/EventStream.js: Live events table, search/filter.
- [ ] Create frontend/src/components/InteractionOverlay.js: Canvas for bounds overlay.
- [ ] Create frontend/src/components/History.js: Paginated history.
- [ ] Create frontend/src/services/websocket.js: WS connection for admin.

## Android Agent (Kotlin)
- [ ] Create android-agent/app/build.gradle: Dependencies (websockets, foreground service).
- [ ] Create android-agent/app/src/main/AndroidManifest.xml: Permissions, service declaration.
- [ ] Create android-agent/app/src/main/java/com/example/agent/AccessibilityService.kt: Capture events, send via WS.
- [ ] Create android-agent/app/src/main/java/com/example/agent/MainActivity.kt: UI for permissions, status.
- [ ] Create android-agent/app/src/main/java/com/example/agent/WebSocketClient.kt: WS connection.

## Shared/Config
- [ ] Create docker-compose.yml: Services for backend, DB, frontend build.
- [ ] Create README.md: Setup instructions, security notes, deployment guide.

## Remote Desktop Module
- [ ] Integrate WebRTC for screen streaming, mouse/keyboard control in backend/frontend.

## Database
- [ ] Set up PostgreSQL schema: Tables: users, devices, interaction_events (id, device_id, ts, app, type, text, view_id, l, t, r, b).
