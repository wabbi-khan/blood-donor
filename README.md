# 🩸 LifeDrop - Blood Donor Web App

LifeDrop is a modern, fast, and responsive web application built to connect blood donors with individuals in urgent need of blood. The platform features location-based donor searching, real-time SOS alerts, and secure user authentication.

## ✨ Features

- **🔐 Secure Authentication:** User login, registration, and password recovery powered by Firebase Authentication.
- **👤 Donor Profiles:** Users can register as donors, complete their profiles with blood group details, and manage their availability.
- **🗺️ Location-Based Donor Search:** An interactive map (powered by Leaflet & GeoFire) allows users to find nearby blood donors based on their location.
- **🚨 SOS Emergency Requests:** Users can create urgent blood requests that are broadcasted to nearby donors.
- **📊 User Dashboard:** A centralized dashboard to manage profile settings, view active requests, and track donation history.
- **🛡️ Protected Routes:** Secure routing ensuring only authenticated users can access sensitive pages.

## 🛠️ Technology Stack

- **Frontend Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/)
- **Form Handling & Validation:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Maps & Geolocation:** [Leaflet](https://leafletjs.com/), React-Leaflet, and [Geofire-Common](https://github.com/firebase/geofire-js)
- **Backend Services:** [Firebase](https://firebase.google.com/) (Auth, Firestore, Hosting)
- **HTTP Client:** [Axios](https://axios-http.com/)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A Firebase Project (with Authentication and Firestore enabled)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd blood-donor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory by copying the example file:
   ```bash
   cp .env.example .env
   ```
   Fill in your Firebase project credentials in the `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   # ... add the rest of the required variables
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📂 Project Structure

```text
src/
├── assets/         # Static assets like images and icons
├── components/     # Reusable UI components (Layout, Common)
├── pages/          # Application pages (Home, Login, SOS, Dashboard, etc.)
├── services/       # External service integrations (Firebase, Auth APIs)
├── store/          # Global state management (AuthContext)
├── utils/          # Helper functions and utilities
├── App.jsx         # Main application router
├── index.css       # Global styles and Tailwind configuration
└── main.jsx        # React application entry point
```

## 📖 How to Use

1. **Sign Up:** Create a new account using the Registration page.
2. **Complete Profile:** After logging in, you will be prompted to complete your profile, including your blood type and location.
3. **Opt-in as a Donor:** In your profile settings, you can toggle your status to become an active donor.
4. **Search for Donors:** Navigate to the "Search Donors" page to use the interactive map and find donors near you.
5. **Create an SOS Request:** In an emergency, go to the "SOS" page to create an urgent blood request which will be visible to matching donors in the vicinity.

---
*Built with ❤️ to save lives.*
