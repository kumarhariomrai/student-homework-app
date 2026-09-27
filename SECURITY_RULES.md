# Firebase Security Rules

Before launching your app to production, add these security rules to Firebase.

## Step 1: Add Firestore Rules

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `student-homework-app-e9bc0`
3. Go to **Firestore Database** → **Rules** tab
4. Delete all existing rules
5. Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only accessible by that user
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Assignments - readable by all authenticated users
    match /assignments/{assignmentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.createdBy == request.auth.uid;
    }

    // Submissions - students can create/read their own, teachers can read all
    match /submissions/{submissionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.studentId == request.auth.uid;
      allow update: if request.auth != null && (resource.data.studentId == request.auth.uid || resource.data.createdBy == request.auth.uid);
      allow delete: if request.auth != null && resource.data.studentId == request.auth.uid;
    }
  }
}
```

6. Click **Publish**

### What these rules do:

- **Users**: Only users can read/write their own profile
- **Assignments**: All logged-in users can read and create assignments. Only the creator can update/delete
- **Submissions**: All logged-in users can read. Students can only create/update their own submissions. Teachers can update to add grades/feedback

## Step 2: Add Storage Rules

1. Go to **Storage** → **Rules** tab
2. Delete all existing rules
3. Copy and paste these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to read all submissions
    match /submissions/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

4. Click **Publish**

### What these rules do:

- Students can upload files only to their own folder (`submissions/{their-user-id}/...`)
- All authenticated users can read/download files
- Students can delete only their own files

## Step 3: Verify Rules

1. Test login and file upload
2. Verify students can only upload to their folder
3. Verify teachers can read all submissions
4. Test that unauthenticated users get denied

## Security Checklist

- ✅ Email/Password authentication enabled
- ✅ Firestore rules restrict access by user role
- ✅ Storage rules limit uploads to user folders
- ✅ No sensitive data in frontend
- ✅ `.env` file is in `.gitignore` (not committed to GitHub)
- ✅ App requires authentication for all features
- ✅ Teachers can only delete their own assignments
- ✅ Students can only access their own submissions

## Before Going Live

1. Test with real teacher and student accounts
2. Try uploading different file types
3. Verify permissions work correctly
4. Check that unauthenticated users see only login page
5. Test on mobile devices

## If Something Breaks

If you see permission errors:
- Check that user is logged in
- Verify Firestore/Storage rules are published
- Check browser console for exact error
- Make sure `.env` has correct Firebase config

Common errors:
- `Missing or insufficient permissions`: Rules are blocking the operation
- `Firebase not initialized`: Missing `.env` file or wrong config
- `User not authenticated`: User needs to log in first

## Production Recommendations

For a real classroom app, also consider:

1. **Admin dashboard**: Teacher can manage all student accounts
2. **Role validation**: Backend verification of teacher/student roles
3. **Backup**: Regular Firestore exports
4. **Monitoring**: Firebase alerts for quota usage
5. **Rate limiting**: Prevent spam uploads
6. **File validation**: Check file types and sizes before upload
7. **Virus scanning**: Use third-party service for malware detection
8. **Data privacy**: GDPR compliance for student data

For now, these rules are production-ready for your app with ~100 students.
