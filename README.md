
# MessEase Admin Portal 🍽️

A modern, comprehensive mess management system designed for institutional dining facilities. **MessEase** streamlines operations, reduces food wastage using AI, and enhances the dining experience for both students and administrators.

## 🚀 Key Features

- **📊 Intelligent Dashboard**: Real-time overview of current occupancy, meal status, and recent feedback.
- **🍗 AI-Powered Meal Planning**: Integrated with **Google Gemini AI** to predict meal quantities, wastage buffers, and inventory needs based on student counts and menu items.
- **📅 Attendance & Leave Management**: Track student leaves and automate attendance to optimize meal preparation.
- **📋 Menu Management**: Easily manage daily and weekly menus, including special items and seasonal changes.
- **📉 Advanced Analytics**: Visualize trends in consumption, wastage, and cost per student through interactive charts (Recharts).
- **💸 Billing & Finance**: Manage mess dues, payments, and financial reports in one centralized place.
- **🗣️ Feedback & Polls**: Collect real-time reviews and run polls to improve food quality and service.
- **🛡️ Secure Authentication**: Managed via **Firebase Auth** with role-based access for administrators.

## 🌐 The MessEase Ecosystem

MessEase is more than just an admin tool; it's a complete ecosystem designed to bridge the gap between mess management and students:

1.  **MessEase Admin Portal (This Repo)**: The command center for mess managers to oversee operations, track analytics, and manage menus.
2.  **MessEase Mobile App**: A dedicated app for students to check daily menus, mark leave, provide feedback, and participate in polls in real-time.

By syncing data across the ecosystem, we ensure that every meal prepared is accounted for, significantly reducing food waste and operational overhead.

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth)
- **AI Integration**: [Google Gemini Pro Flash 1.5](https://deepmind.google/technologies/gemini/)

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd messease-admin-portal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your credentials:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🏗️ Project Structure

```text
├── components/         # UI Components (Dashboard, Analytics, etc.)
├── services/           # API and Firebase Service logic
│   └── gemini.ts       # AI Prediction logic
├── types.ts            # Common TypeScript interfaces
├── firebaseConfig.ts   # Firebase client initialization
├── App.tsx             # Main application layout and routing
└── index.tsx           # Entry point
```

## 🚢 Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Ensure the **Framework Preset** is set to **Vite**.
3. Add all environment variables from `.env.local` to Vercel's project settings.
4. **Crucial**: Add your Vercel deployment URL to the **Authorized Domains** in the Firebase Console (Authentication > Settings).

## 📄 License

This project is licensed under the MIT License.
