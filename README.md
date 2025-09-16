# Police Management Backend

## Important Notice

Before starting this application, you need to have:

1. A registered police station
2. Proper authorization from relevant authorities to operate a police management system
3. Compliance with local laws and regulations regarding police data management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- postgresql
- A registered organization with proper authorization

### Installation

#### Frontend Setup

1. Clone the repository:
    ```json
    https://github.com/auxplutes-admin/be_police_management.git
    ```
2. Navigate to frontend:
    ```json
    cd be_police_management
    ```

3. Install dependencies:
    ```json
    npm install
    ```

4. Create a ```.env``` file in the backend directory and add required environment variables:
    ```
    PORT = 9000

   JWT_SECRET = 7a3b5f8c2d1e9048b6f0a2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

    NODE_ENV = "production"

    POSTGRES_HOST = postgres
    POSTGRES_USER = admin
    POSTGRES_PASSWORD = password
    POSTGRES_DB = aifunnelplus
    POSTGRES_PORT = 5440  
    POSTGRES_SSL = false

    FRONTEND_URL = "http://localhost:3000"

    ```

5. Start the backend server:
    ```json
    npm run dev
    ```
6. Open your browser and visit:
    ```
    http://localhost:9000
    ```

7. Create a police station using curl:
    ```bash
    curl -X POST http://localhost:9000/api/police-stations/create \
    -H "Content-Type: application/json" \
    -d '{
        "station_name": "Baner",
        "station_code": "MH_PL_BANER",
        "station_phone": 9876543210,
        "station_email": "baner@gmail.com", 
        "station_latitude": 18.5686432,
        "station_longitude": 73.7749747,
        "station_zone": "ZONE_4",
        "station_address": "Ganeshkhind, Pune, Maharashtra, India",
        "station_city": "Pune",
        "station_state": "Maharashtra",
        "station_jurisdiction": "Pune",
        "station_type": "",
        "station_incharge": "PI Ganesh"
    }'
    ```

The application should now be running.
