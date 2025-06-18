# 🧠 Student Progress Tracker — Codeforces Dashboard

Track Codeforces contest history, problem-solving stats, and student activity — all in one dark-themed dashboard.  
Built with the **MERN stack**, supports **email reminders** for inactive students, and runs both traditionally or via Docker.

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js >= 16
- MongoDB (local or Mongo Atlas)
- Gmail (App Password enabled for email)
- Docker (optional, for containerized setup)

---

## 🛠️ Traditional (Manual) Setup

### 📁 1. Clone the Repository

```bash
git clone https://github.com/yourusername/codeforces-dashboard.git
cd codeforces-dashboard
```

### ⚙️ 2. Backend Setup

```bash
cd backend
cp .env.example .env  # Edit MongoDB URI and Gmail credentials

npm install
npm run dev
```

> ⚠️ Ensure MongoDB is running and accessible at the URI in `.env`.

### 💻 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit: [http://localhost:5173](http://localhost:5173)

---

## 🐳 Docker Setup (Recommended)

This will run both backend and frontend on a shared Docker network.

### ▶️ 1. Docker Compose

At the root of the project:

```bash
docker-compose up --build
```

### 🌐 App URLs

- Frontend → [http://localhost:5173](http://localhost:5173)
- Backend → [http://localhost:3000/api](http://localhost:3000/api)

### 📬 Email Reminders

- Backend will send reminders at the configured cron time (`AppSetting` stored in DB)
- Make sure `.env` in backend contains Gmail App Password and Mongo URI

---

## 🔧 Environment Variables

### backend/.env

```env
PORT=3000
MONGODB_URI=mongodb://mongo:27017/codeforces
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

---

## 🧼 To Clean Up Docker

```bash
docker-compose down
```

---

## 🧠 Features

- 📊 Track student Codeforces performance (ratings, heatmaps, etc.)
- 📥 Add/edit/delete student profiles
- 📧 Automatically email inactive students
- 🌙 Dark mode by default
- 📅 Fully configurable from `/settings` page (inactivity days, email toggle, cron time)

---

## 🙌 Contributions Welcome!

Feel free to fork and PR — or open issues to suggest improvements.