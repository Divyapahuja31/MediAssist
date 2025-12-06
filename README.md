# 🏥 MediAssist – Digital Health Companion

**MediAssist** is a personal health and medicine management application designed to simplify the daily management of medications, prescriptions, and emergency health details.

> **Project by:** Divya Pahuja (2024-B-24052005A)

---

## 📖 Table of Contents
- [Problem Statement](#-problem-statement)
- [Proposed Solution](#-proposed-solution)
- [Key Features](#-key-features)
- [Target Audience](#-target-audience)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)

---

## ❓ Problem Statement
Managing daily medicines, prescriptions, and emergency health details is difficult for many people. Common issues include:
*   ⏰ **Forgetting** to take medicines on time.
*   📋 **Scattered Prescriptions** across different places.
*   😓 **No Central Space** to track medicine schedules.
*   🚨 **Emergency Info** not instantly available during critical moments.

**MediAssist aims to solve these challenges by providing a simple, centralized digital health companion.**

---

## 💡 Proposed Solution
MediAssist is a mobile application built using **React Native**, backed by a solid **Node.js** & **PostgreSQL** architecture. It offers:
*   📲 Easy medicine scheduling and reminders.
*   🗂️ Digital storage for prescriptions.
*   📡 QR-based emergency health card for instant access.
*   🔐 Secure authentication with JWT.
*   💾 Offline accessibility for critical health data.

---

## 🌟 Key Features

### 💊 Medicine Reminders & Schedules
Create and manage medicine timings, dosage, and frequency so you never miss a dose.

### 📂 Digital Prescription Storage
Upload and view prescription images directly in the app, keeping your medical history organized.

### 🚨 Emergency Health Card (QR Code)
Generate a QR code containing vital info like blood group, allergies, and emergency contacts for first responders.

### 🔐 Secure & Private
User registration and login are protected with encrypted authentication (JWT).

### 📈 Adherence Tracking
Mark doses as “Taken” or “Missed” to track your consistency over time.

### 🔔 Smart Notifications
Device registration ensures you receive push notifications for your scheduled medicines.


---

## 👥 Target Audience
*   👵 **Elderly patients** who need simple reminders.
*   👨‍👩‍👧 **Families** managing the health of dependents.
*   💊 **People with chronic illnesses** requiring regular medication.
*   🚑 **Anyone** who values quick access to emergency health information.

---

## 🛠️ Technology Stack

### Frontend (Mobile)
*   **[React Native](https://reactnative.dev/)** - For a seamless cross-platform mobile experience.
*   **Expo Image Picker** - For handling prescription uploads.
*   **AsyncStorage** - For local data caching and offline support.

### Backend (API)
*   **[Node.js](https://nodejs.org/)** & **[Express.js](https://expressjs.com/)** - For a robust and scalable server API.
*   **QR Code Generator** - For creating the emergency health card.

### Database
*   **[PostgreSQL](https://www.postgresql.org/)** (Neon) - For reliable, relational data storage.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js installed
*   npm or yarn
*   PostgreSQL database setup

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Divyapahuja31/MediAssist.git
    cd MediAssist
    ```

2.  **Setup the Backend**
    ```bash
    cd backend
    npm install
    # Set up your .env file with DB credentials
    npm run dev
    ```

3.  **Setup the Frontend**
    ```bash
    cd frontend
    npm install
    npm start
    ```

---

## 📅 Roadmap

*   **Week 1–2:** Research & UI/UX Design ✅
*   **Week 3–4:** Backend & Database Setup 🏗️
*   **Week 5–6:** Core Features Implementation 🚧
*   **Week 7:** Testing & Bug Fixes 🐛

---

## 📝 Additional Notes
*   📌 Designed with a modular structure for future enhancements.
*   📌 Can be expanded into a full health-tech system.
*   📌 Suitable for academic evaluation and real-world use.
