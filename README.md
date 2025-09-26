# 🏥 MediAssist – Digital Health Companion

> A **mobile-first full-stack app** that simplifies medicine management, prescription storage, and emergency health access for patients, families, and caregivers.  
> Built with **React Native, Node.js, and MySQL**, MediAssist ensures patients never miss a dose, digitizes health records, and provides life-saving emergency information instantly.

---

## 📌 Table of Contents
- [📖 Project Overview](#-project-overview)
- [⚡ Features](#-features)
- [🎯 Target Users](#-target-users)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Expected Outcomes](#-expected-outcomes)
- [📅 Project Timeline](#-project-timeline)
- [📂 Folder Structure](#-folder-structure)
- [⚙️ Installation & Setup](#️-installation--setup)
- [🤝 Contribution Guidelines](#-contribution-guidelines)
- [📌 Future Scope](#-future-scope)
- [👩‍💻 Author](#-author)

---

## 📖 Project Overview
Managing medicines, prescriptions, and health records is often stressful:  
⏰ Patients forget to take medicines on time.  
📋 Prescriptions/reports are scattered across papers & devices.  
🚨 In emergencies, critical health data isn’t easily accessible.  

**MediAssist** provides a **centralized, secure, and intelligent health companion** to solve these challenges.  

---

## ⚡ Features

### ✅ Core MVP (Phase 1)
- ⏰ **Medicine Reminders** → Schedule medicines with time, dosage, and frequency + push notifications.  
- 📂 **Digital Prescription Storage** → Upload and manage prescriptions/reports (images/PDFs).  
- 🚨 **Emergency Health Card** → QR-based card with allergies, blood group, and emergency contacts.  
- 🔐 **Secure Authentication** → JWT-based login with encrypted storage.  
- 📴 **Offline Support** → Access reminders & prescriptions without internet.  

### 🚀 Advanced (Phase 2)
- 🤖 **AI Insights** → Track missed doses and suggest adherence improvements.  
- 👨‍👩‍👧 **Family/Dependent Accounts** → Manage parents’/children’s medications.  
- 🏥 **Doctor/Pharmacy Integration** → Share prescriptions digitally with clinics or pharmacies.  
- 💊 **Refill & Stock Alerts** → Notifications when medicines are running low.  
- 📊 **Health Journal & Reports** → Symptom/vitals logs with interactive charts.  
- 🏆 **Gamification** → Streaks, badges, and rewards for consistent medicine adherence.  

---

## 🎯 Target Users
- 👵 Elderly patients managing multiple medicines.  
- 👨‍👩‍👧 Families managing dependents’ health.  
- 💊 Chronic illness patients requiring long-term medication.  
- 🏥 Clinics & pharmacies (future scope).  

---

## 🛠️ Tech Stack
- **Frontend (Mobile):** React Native (Expo) 📱  
- **Backend:** Node.js + Express.js 🌐  
- **Database:** MySQL 🗄️  
- **Extras:**  
  - 🔔 Firebase Cloud Messaging → Push Notifications  
  - 🔐 JWT Authentication → Secure Login  
  - 📡 QR Code Generator → Sharing Prescriptions & Emergency Card  
  - 💾 AsyncStorage → Offline Caching  
  - 🤖 (Optional) TensorFlow.js / OpenAI → AI-driven Insights  

---

## 🚀 Expected Outcomes
- Patients **never miss medicine doses**.  
- A **single digital locker** for prescriptions and reports.  
- Instant access to **life-saving emergency information**.  
- Better understanding of **medicine adherence patterns**.  
- Reduced dependency on **paper records**.  

---

## 📅 Project Timeline
| Week | Milestone |
|------|------------|
| 1–2  | Research & UI/UX Design 🎨 |
| 3–4  | Backend & Database Setup ⚙️ |
| 5–6  | Core Features (Reminders, Prescriptions, Emergency Card) 📲 |
| 7    | Advanced Features (AI Insights, Family Accounts, Pharmacy Integration) 🤖 |
| 8    | Testing, Bug Fixes & Deployment 🚀 |

---

## 📂 Folder Structure
```bash
MediAssistApp/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # App screens (Home, Medications, Records, etc.)
│   ├── navigation/       # Navigation (Stack + Tabs)
│   ├── context/          # Context API providers
│   ├── services/         # API + storage services
│   └── types/            # TypeScript types & interfaces
├── assets/               # Images, icons, fonts
├── App.tsx               # App entry point
└── package.json
```
## ⚙️ Installation & Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/MediAssist.git
cd MediAssistApp
```
Install Dependencies
```
npm install
```
Run the App
```
npx expo start
```
Backend Setup

Navigate to /server folder

Install dependencies:
```
npm install
```

Start the server:
```
npm run dev
```
🤝 Contribution Guidelines

Follow clean coding practices and maintain consistency.

Use meaningful commit messages (e.g., feat: add medicine reminder screen).

Stick to the folder structure for maintainability.

Always run:
```
npm run lint
```

before pushing code.

📌 Future Scope

📲 Integration with wearables (smartwatches, fitness bands) for vitals monitoring.

🏥 Partnerships with clinics & pharmacies for e-prescriptions.

💳 Monetization via premium plans (AI insights + unlimited storage).

🌍 Expand into a health-tech startup app with real-world adoption.

👩‍💻 Author

Divya Pahuja – 2024-B-24052005A
B.Tech Computer Science, NST
