# Getting Started with Create React App

#  NGO CMS - Login & Dashboard Module
 

##  Project Overview

This project is part of an internship assignment to build a Content Management System (CMS) for an NGO.
This module implements a complete authentication system with a dashboard.

---

##  Features

*  User Login (Database-based authentication)
*  Dashboard after login
*  Protected routes (dashboard access restricted)
*  Logout functionality
*  Loading state and error handling
*  Clean UI

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router

### Backend

* Django
* Django REST (basic API)

### Database

* SQLite (will be upgraded to MySQL)

---

## 📂 Project Structure

```
frontend/
  src/
    components/
      Login.js
      Dashboard.js
    App.js

backend/
  accounts/
  backend/
  manage.py
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```
git clone https://github.com/your-username/your-repo.git
```

---

### 2️⃣ Backend Setup

```
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm start
```

Create a `.env` file in the frontend root:

```
REACT_APP_API_BASE_URL=http://127.0.0.1:8000
```

For live deployment (for example Vercel), set:

```
REACT_APP_API_BASE_URL=https://ngo-cms-bwvq.onrender.com
```

---

## 🌐 Live Demo

* Frontend: https://ngo-cms-sigma.vercel.app/
* Backend: https://ngo-cms-bwvq.onrender.com/login/

---


## 🔑 Test Credentials

```
Email: vivkrut@gmail.com
Password: Veer@3201
```

---



## 👨‍💻 Author

Vivek Chudasama
