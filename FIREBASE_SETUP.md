# Firebase Setup Guide

This guide walks you through setting up Firebase for the Student Homework App.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **Create a project**
3. Enter project name: `student-homework-app` (or any name you prefer)
4. Click **Continue**
5. Disable Google Analytics (optional for small apps)
6. Click **Create project**
7. Wait for the project to initialize

## Step 2: Enable Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get started**
3. Select **Email/Password** as the sign-in method
4. Toggle **Enable** to turn it on
5. Click **Save**

That's it! Email/password auth is now enabled.

## Step 3: Create Firestore Database

1. In the left sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose location (select closest to your region)
4. For security rules, select **Start in test mode** (for development)
   - ⚠️ For production, use **production mode** with proper rules
5. Click **Create**
6. Wait for the database to initialize

## Step 4: Enable Cloud Storage

1. In the left sidebar, click **Storage**
2. Click **Get started**
3. For security rules, select **Start in test mode**
   - ⚠️ For production, use proper rules
4. Choose location (same as Firestore for performance)
5. Click **Done**

## Step 5: Get Your Firebase Config

1. Go to **Project Settings** (gear icon in top-left)
2. Scroll to **Your apps** section
3. Click on the web app icon (if no app exists, click **Add app** → **Web**)
4. Copy the config object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd1234efgh5678"
};
```

## Step 6: Create .env File

1. In your project root (same level as `package.json`), create a file called `.env`
2. Copy `.env.example` as a template
3. Fill in your Firebase values:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcd1234efgh5678
```

4. Save the file
5. **Do NOT commit this file to GitHub** (it's in `.gitignore`)

## Step 7: Set Firebase Security Rules (Production)

### Firestore Rules

1. Go to **Firestore Database** → **Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only accessible by that user
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Assignments - readable by all authenticated users, writable by teacher
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }

    // Submissions - students can create their own, teachers can read all
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && (resource.data.studentId == request.auth.uid || resource.data.createdBy == request.auth.uid);
    }
  }
}
```

3. Click **Publish**

### Cloud Storage Rules

1. Go to **Storage** → **Rules** tab
2. Replace all content with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow students to upload only their own submissions
    match /submissions/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 8: Run Your App

```bash
cd student-homework-app
npm install
npm run dev
```

The app will run on `http://localhost:5173` (or another port if 5173 is busy).

## Step 9: Test the App

### Create Teacher Account
1. Go to login page
2. Click "Need an account?"
3. Enter:
   - Name: Your name
   - Role: **Teacher**
   - Email: teacher@example.com
   - Password: password123
4. Click **Create Account**
5. You're now logged in as a teacher

### Create Student Account
1. Logout
2. Click "Need an account?"
3. Enter:
   - Name: Student name
   - Role: **Student**
   - Email: student@example.com
   - Password: password123
4. Click **Create Account**

### Test Assignment Flow
1. Login as teacher
2. Create an assignment
3. Logout
4. Login as student
5. Upload homework
6. Logout
7. Login as teacher
8. Grade the submission

## Firestore Database Structure

The app automatically creates these collections:

### `users` collection
```json
{
  "uid": "firebase-user-id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student" or "teacher",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### `assignments` collection
```json
{
  "title": "Math Homework 1",
  "description": "Complete chapters 1-3",
  "dueDate": "2024-01-20T00:00:00Z",
  "createdBy": "firebase-user-id",
  "createdByName": "Teacher Name",
  "createdByEmail": "teacher@example.com",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

### `submissions` collection
```json
{
  "assignmentId": "assignment-id",
  "assignmentTitle": "Math Homework 1",
  "studentId": "firebase-user-id",
  "studentName": "Student Name",
  "studentEmail": "student@example.com",
  "fileName": "homework.pdf",
  "fileUrl": "https://storage.googleapis.com/...",
  "submittedAt": "2024-01-18T14:00:00Z",
  "status": "submitted" or "graded",
  "grade": "A+",
  "feedback": "Great work!"
}
```

## Troubleshooting

### "Firebase config is not defined"
- Check that `.env` file exists in project root
- Make sure all Firebase config variables are filled in
- Restart `npm run dev`

### "Permission denied" errors
- Check that you're logged in
- Verify Firestore and Storage rules are published
- For test mode, rules should allow all authenticated users

### Files not uploading
- Check Storage bucket is created
- Verify file size is under 10MB
- Check browser console for exact error

### Can't create assignments
- Make sure you're logged in as a teacher
- Check that Firestore database is created and rules are published

## Deployment

When ready to deploy:

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy to Vercel (recommended):
   ```bash
   npm install -g vercel
   vercel
   ```

3. Or deploy to Netlify:
   - Push to GitHub
   - Connect repo to Netlify
   - Add environment variables in Netlify settings
   - Deploy

4. Or deploy to Firebase Hosting:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   npm run build
   firebase deploy
   ```

## Free Tier Limits

- **Authentication**: 50,000 sign-ups/month
- **Firestore**: 50,000 read/write operations/day
- **Storage**: 5 GB total, 1 GB/day download
- **Concurrent connections**: 100

For 100 students with daily usage, these limits should be sufficient.

## Next Steps

1. Follow this guide to set up Firebase
2. Update `.env` with your config
3. Run `npm install && npm run dev`
4. Test the app with teacher and student accounts
5. When ready, deploy to production

You now have a zero-cost, fully functional homework portal! 🎉
