# Rent-a-Bike Management System

A full-stack system designed to manage bike rentals (rentals and returns) and inventory (adding new bikes, updating bike information, and mainteining and removing bikes). The system includes a mobile application for customers to rent bikes and a web application for administrators to manage the inventory and rentals.

## Features

The following are broad descriptions of the features implemented in the system, for more detailed information, please refer to the [documentation](/docs) in the codebase.

- **Customer Mobile Application**:
  - Browse available bikes - on interactive map and list view
  - Rent a bike - via QR code scanning
  - Return a bike - providing photo of the bike and its condition
  - View rental history
  - Report issues with bikes - providing photo and description

- **Administrator Web Application**:
  - Add new bikes to inventory
  - Update bike information
  - Review reported issues - resolve them by ignoring them, sending bike for maintenance, or removing the bike from inventory
  - View rental history for all customers

- **Profile Management**:
  - All users can view and update their profile information, including name, email, and password

## System Architecture

The system follows a client-server architecture with a RESTful API for communication between the frontend and backend. The mobile application and web application both interact with the backend server to perform CRUD operations on the bike inventory and rental data.

- [Backend](./backend): Handles business logic, database interactions, and API endpoints for the mobile and web applications.
- [Shared](./shared): local npm module consisting of shared TypeScript models and utilities as well as the API client used by both the web and mobile applications to communicate with the backend server. It includes custom hooks for data fetching and state management using React Query.
- [Web Frontend](./web): Provides an interface for administrators to manage the bike inventory and rentals.
- [Mobile Frontend](./mobile): Provides an interface for customers to browse and rent bikes, as well as report issues and view their rental history.

## Technologies Used

- **Web**: React.js + Vite + Tailwind CSS
- **Mobile**: React Native + Expo + NativeWind CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Language**: TypeScript
- **State Management**: React Query

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Zerato7/rent-a-bike.git
   ```

2. Navigate to the project directory:
   ```bash
   cd rent-a-bike
   ```

3. Install dependencies for the backend:
   ```bash
   cd backend
   npm install
   ```

   Add a `.env` file in the `backend` directory with the following content:
   ```
   PORT=your_desired_port
   DB_URL=your_mongodb_connection_string
   ```

4. Install dependencies for the frontend:
   ```bash
   cd ../web
   npm install
   cd ../mobile
   npm install
   ```

   Add a `.env` file in the `web` directory with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:your_desired_port
   ```

   Add a `.env` file in the `mobile` directory with the following content:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.x.x:your_desired_port
   ```
   `192.168.x.x` should be replaced with your local IP address to allow the mobile app to communicate with the backend server.

5. Start the backend server:
   ```bash
   cd ../backend
   npm run build
   npm run start
   ```

6. Start the frontend application:
   ```bash
   cd ../web
   npm run dev
   cd ../mobile
   npx expo start
   ```

## Usage

- Access the customer mobile application on your device or emulator to browse and rent bikes.
- Access the administrator web application at `http://localhost:5173` to manage inventory and rentals.

### Mock Data

The system includes mock data for testing purposes. You can find the mock data in the [data](/data) directory. Part of the mock data (photos) is stored in the `backend/public/uploads` directory.