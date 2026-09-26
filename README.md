# Student Homework App

A zero-cost homework portal for teachers and students built with React + Firebase.

## Features

- Student login and signup
- Teacher login and signup
- Create homework assignments
- Upload homework submissions as files
- View submitted work
- Uses Firebase free tier for auth, database, and storage

## Tech Stack

- React
- Vite
- Firebase Authentication
- Firestore
- Firebase Storage

## Prerequisites

- Node.js 18+
- A Firebase project
- A browser

## Firebase Setup

1. Go to the Firebase Console.
2. Create a new project.
3. Enable:
   - Authentication
   - Firestore Database
   - Storage
4. In Authentication, enable Email/Password sign-in.
5. In Firestore, create a database in test mode or secure mode.
6. In Storage, create a default bucket.

## Environment Variables

Create a `.env` file in the project root with:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

You can copy `.env.example` as a starting point.

## Install and Run

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

## Firebase Security Rules (Recommended)

### Firestore rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }

    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.studentId == request.auth.uid;
    }
  }
}
```

### Storage rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /submissions/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Usage

### Teacher
- Create an account with the role "Teacher"
- Create assignments
- View student submissions
- Download submitted files

### Student
- Create an account with the role "Student"
- View assigned homework
- Upload answer files
- See submission status

## Cost

This app is designed for the Firebase free tier and is suitable for a small app with around 100 students.

## Notes

- This is a prototype starter app.
- For production, add admin controls, grading, notifications, and stronger role validation.
- Do not keep production secrets in the frontend.
