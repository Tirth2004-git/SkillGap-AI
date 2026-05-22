# SkillGap AI — Career Readiness Analyzer for Students

SkillGap AI is a professional full-stack MERN web application powered by the Gemini API. It enables students to evaluate their career readiness by uploading their PDF resumes and selecting target job roles. The system extracts resume text, checks ATS compatibility, conducts a detailed skill gap analysis, suggests resume updates, and generates a personalized 30-day learning roadmap accompanied by recommended course pathways.

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-purple.svg)](https://mongodb.com)
[![Gemini AI](https://img.shields.io/badge/Powered%20By-Gemini%20API-blue.svg)](https://deepmind.google/technologies/gemini/)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT%20%26%20Bcrypt-orange.svg)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/CSS-Tailwind-blueviolet.svg)](https://tailwindcss.com/)

---

## 🚀 Key Features

*   **Secure Authentication System**:
    *   JWT-token-based authorization.
    *   Bcrypt-hashed password storage in MongoDB.
    *   Protected client-side routing & Axios request interceptors.
*   **Resume Parser & Upload**:
    *   Drag-and-drop or file-picker upload support for `.pdf` format.
    *   File size and extension validation.
    *   Dynamic, in-memory parsing using `pdf-parse` (temp files are deleted immediately after analysis).
*   **AI Resume Assessment & ATS Score**:
    *   Computes an ATS score matching index out of 100.
    *   Extracts strong match-up qualifications and flags missing technical keywords.
    *   Returns structural recommendations (bullet rewrites, content formatting, etc.).
*   **30-Day Day-Wise Study Roadmap**:
    *   A structured day-by-day learning program partitioned into 4 distinct weeks.
    *   Interactive client check-boxes to track learning progress.
*   **Tailored Course Recommendations**:
    *   Points students to learning materials from platforms like **freeCodeCamp, YouTube, Coursera, and Udemy** based on their identified skill gaps.
*   **Dashboard Analytics**:
    *   Aggregated resume scan statistics (Scan counts, Average scores, High scores).
    *   Historical scans log to review or remove past records.
*   **Modern Aesthetics**:
    *   Glassmorphism UI cards, animated gradients, custom webkit-scrollbars, responsive navigation layouts, and step-based parser progress bars.

---

## 📁 Project Structure

```text
skillgap-ai/
├── client/                  # Frontend Vite + React + Tailwind
│   ├── src/
│   │   ├── components/      # Sidebar, ProtectedRoute, LoadingScreen
│   │   ├── context/         # AuthContext (login, register, session)
│   │   ├── pages/           # Home, Login, Register, Dashboard, Upload, AIReport
│   │   ├── services/        # api.js (Axios connection endpoint client)
│   │   ├── App.jsx          # Route mapping
│   │   ├── index.css        # Tailwind style directives
│   │   └── main.jsx         # React DOM render entry
│   ├── tailwind.config.js
│   └── package.json
│
└── server/                  # Backend Express Node API
    ├── controllers/         # authController, resumeController
    ├── middleware/          # authMiddleware
    ├── models/              # User, Report Mongoose schemas
    ├── routes/              # authRoutes, resumeRoutes
    ├── uploads/             # Temporary folder for Multer diskStorage
    ├── utils/               # gemini.js (Google Gen AI integration)
    ├── server.js            # Express API bootstrap
    └── package.json
```

---

## 🛠️ Installation & Configuration

### Prerequisites
*   [Node.js](https://nodejs.org/en/) installed locally.
*   [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas connection URI.
*   A Gemini API Key (obtained from [Google AI Studio](https://aistudio.google.com/)).

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/skillgap-ai.git
cd skillgap-ai
```

### Step 2: Set Up Backend Environment
Navigate to the `server/` directory and configure your `.env` variables:
```bash
cd server
touch .env
```
Inside the `.env` file, fill in the following configurations:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/skillgap-ai
JWT_SECRET=your_jwt_secret_hash_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

### Step 3: Install Dependencies
Run npm installations in both the `client/` and `server/` directories:
```bash
# Server setup
cd server
npm install

# Client setup
cd ../client
npm install
```

### Step 4: Run the Application

#### Start the Backend API Server:
```bash
cd server
npm run dev
```
*(Runs on `http://localhost:5000`)*

#### Start the Frontend Client:
```bash
cd client
npm run dev
```
*(Runs on `http://localhost:5173`)*

---

## 📡 REST API Documentation

### Auth Endpoints
*   `POST /api/auth/register` - Registers a new user account.
*   `POST /api/auth/login` - Validates credentials and returns JWT.
*   `GET /api/auth/profile` - Returns account details *(Requires Authorization Header)*.

### Resume & Report Endpoints *(All routes require Authorization Header)*
*   `POST /api/resume/upload` - Uploads a PDF resume, parses, triggers Gemini API, and saves report.
*   `GET /api/resume/history` - Fetches a list of past scans.
*   `GET /api/resume/report/:id` - Retrieves a specific report.
*   `DELETE /api/resume/report/:id` - Deletes a specific report.

---

## 🛡️ License

This project is licensed under the MIT License - see the LICENSE file for details.
