# Modern Full-Stack Developer Portfolio

A responsive, and premium Full-Stack Developer Portfolio website designed for Sandeep Prajapati, optimized for internship and placement applications. Built using a **React.js** frontend with custom Glassmorphism CSS, and a **Node.js / Express** REST API backend backed by **MongoDB**.

## Features

- 🌓 **Dark/Light Mode**: Smooth transitions between professional dark and crisp light themes.
- 🧊 **Glassmorphism UI**: Backdrop filters, glowing accents, and smooth hover translations.
- 📱 **Fully Responsive**: Crafted to look stunning across desktop, tablet, and mobile displays.
- ⚙️ **Control Panel**: Administrative portal (`/admin` view toggle in navbar) to:
  - Add, edit, and delete projects.
  - Add, edit, and delete certifications.
  - View, mark read/unread, and delete incoming contact form messages.
- 📦 **Offline Fallbacks**: Automatically falls back to predefined offline projects/certifications if the backend or MongoDB is not running, ensuring a fully functional display at all times.
- 🚀 **Deployment Configurations**: Pre-configured for seamless deployments on Vercel (Frontend) and Render (Backend).

---

## Folder Structure

```
/portfolio-workspace
├── /backend            # Express API Server
│   ├── /config         # MongoDB Connection
│   ├── /controllers    # Mongoose Route Logic
│   ├── /models         # Schemas (Contact, Project, Certification)
│   ├── /routes         # Express API endpoints
│   ├── /middleware     # JWT and input validation
│   ├── .env            # Environment Configuration
│   ├── seed.js         # Sample Data Seeding Script
│   └── server.js       # Main server entrypoint
└── /frontend           # React.js SPA (Vite)
    ├── /public         # Static assets (Favicons, resume placeholder)
    ├── /src
    │   ├── /components # Navbar, Hero, About, Skills, Projects, timeline, Contact, etc.
    │   ├── /context    # ThemeContext provider
    │   ├── /hooks      # Custom intersection scroll observers
    │   ├── App.jsx     # SPA Routing and coordinator
    │   ├── index.css   # Main design system & custom CSS variables
    │   └── main.jsx    # React DOM mount root
    └── vercel.json     # Vercel SPA route rewrite rules
```

---

## Local Development Setup

### Prerequisites

1. [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
2. [MongoDB](https://www.mongodb.com/) (Optional - the application will run in offline mode using local mock lists if MongoDB is not present)

### 1. Set Up the Backend API

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Set up environment variables. An `.env` file has been pre-configured with local defaults:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio
   JWT_SECRET=super_secret_jwt_key_sandeep_portfolio_9988
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=admin123
   NODE_ENV=development
   ```
4. *(Optional)* Seed the database with sample projects and certifications (requires MongoDB running):
   ```bash
   npm run seed
   ```
5. Start the backend dev server (runs on port `5000`):
   ```bash
   npm run dev
   ```

### 2. Set Up the Frontend App

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## Administrative Actions

To access the Admin Panel:
1. Click the **Gear (Settings) Icon** in the top right navbar.
2. Sign in using the credentials defined in the backend `.env` file (Default: Username: `admin`, Password: `admin123`).
3. You can now read/delete messages, and CRUD projects and certifications. Changes will update the frontend in real-time.

---

## Deployment Instructions

### Frontend (Vercel)

The frontend is ready to deploy to [Vercel](https://vercel.com/):
1. Import the `/frontend` directory as a new project in Vercel.
2. Configure the **Build Command**: `npm run build`
3. Configure the **Output Directory**: `dist`
4. Set the Environment Variable:
   - `VITE_BACKEND_URL`: URL of your deployed Express API (e.g., `https://your-backend.onrender.com`)

### Backend (Render)

The backend is ready to deploy to [Render](https://render.com/):
1. Create a new **Web Service** on Render, pointing to the `/backend` directory.
2. Select **Runtime**: `Node`
3. Set the **Build Command**: `npm install`
4. Set the **Start Command**: `node server.js`
5. Configure Environment Variables in the Render Dashboard:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random secret string.
   - `ADMIN_USERNAME`: Your custom admin username for dashboard login.
   - `ADMIN_PASSWORD`: Your custom admin password.
   - `NODE_ENV`: `production`
