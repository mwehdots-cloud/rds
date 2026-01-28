# Remote Desktop System

A secure backend/admin panel with remote desktop functionality and Android interaction tracking.

## Features

- **Authentication & Security**: JWT-based admin login with role-based access.
- **Device Management**: List, approve, and monitor connected devices.
- **Real-time Interaction Tracking**: Capture and stream Android UI interactions via Accessibility Service.
- **Admin Dashboard**: React-based UI for device management and event viewing.
- **WebSocket Communication**: Real-time data exchange between devices and admin panel.

## Architecture

- **Backend**: FastAPI (Python) with WebSocket support, PostgreSQL database.
- **Frontend**: React with Tailwind CSS.
- **Android Agent**: Kotlin app using Accessibility Service for interaction capture.
- **Deployment**: Docker-based setup for easy deployment.

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Android Studio (for building the Android agent)
- Node.js and Python (for local development)

### Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd remote-desktop-system
   ```

2. Start the services:
   ```bash
   docker-compose up --build
   ```

3. Access the admin panel at `http://localhost:3000`

4. Build the Android agent:
   - Open `android-agent` in Android Studio
   - Build and install the APK on a test device

### Manual Setup

#### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables (create `.env` file):
   ```
   DATABASE_URL=postgresql://user:password@localhost/remotedesktop
   SECRET_KEY=your-secret-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. Set up PostgreSQL database and run migrations.

5. Start the server:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

#### Android Agent

1. Open the `android-agent` directory in Android Studio.

2. Update the WebSocket URL in `AccessibilityService.kt` to point to your backend.

3. Build and run the app on an Android device.

4. Enable the Accessibility Service in device settings.

## Security Notes

- Use HTTPS in production for encrypted communication.
- Generate strong, unique API keys for each device.
- Implement proper authentication and authorization.
- Regularly update dependencies to address security vulnerabilities.
- Store sensitive data securely (use environment variables, not hardcoded values).

## Deployment Guide

### VPS Deployment

1. Provision a VPS with Docker support.

2. Clone the repository and navigate to the project directory.

3. Update environment variables in `docker-compose.yml` for production.

4. Run the application:
   ```bash
   docker-compose up -d
   ```

5. Set up a reverse proxy (e.g., Nginx) for HTTPS.

6. Configure firewall rules to allow necessary ports.

### Additional Considerations

- Use a domain name and SSL certificate for secure access.
- Implement monitoring and logging for production deployments.
- Consider using a load balancer for high-traffic scenarios.
- Regularly backup the database.

## API Documentation

The backend provides REST and WebSocket APIs. Access the interactive API docs at `http://localhost:8000/docs` when running locally.

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Submit a pull request.

## License

This project is licensed under the MIT License.
