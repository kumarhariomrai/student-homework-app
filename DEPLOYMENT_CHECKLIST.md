# Deployment Checklist

Before launching your Student Homework App, follow this checklist:

## ✅ Firebase Setup

- [ ] Firebase project created
- [ ] Authentication → Email/Password enabled
- [ ] Firestore Database created
- [ ] Cloud Storage created
- [ ] Firestore security rules added and published
- [ ] Storage security rules added and published
- [ ] `.env` file has all Firebase config variables
- [ ] `.env` file is in `.gitignore` (not committed to GitHub)

## ✅ Local Testing

- [ ] Run `npm install`
- [ ] Run `npm run dev`
- [ ] Create teacher account
- [ ] Create student account
- [ ] Teacher creates assignment
- [ ] Student uploads homework
- [ ] Teacher views submission
- [ ] Teacher adds grade and feedback
- [ ] Student sees feedback
- [ ] Test logout and re-login

## ✅ Code Quality

- [ ] No console errors in browser
- [ ] No Firebase errors in console
- [ ] All buttons work
- [ ] Form validation works
- [ ] File upload works (max 10MB)
- [ ] Timestamps display correctly
- [ ] Mobile view works (responsive)

## ✅ GitHub

- [ ] Code is committed
- [ ] Code is pushed to GitHub
- [ ] No sensitive info in repo (check `.gitignore`)
- [ ] README.md is clear
- [ ] `.env` is NOT in the repo

## ✅ Vercel Deployment

- [ ] GitHub repo connected to Vercel
- [ ] Environment variables added to Vercel:
  - VITE_FIREBASE_API_KEY
  - VITE_FIREBASE_AUTH_DOMAIN
  - VITE_FIREBASE_PROJECT_ID
  - VITE_FIREBASE_STORAGE_BUCKET
  - VITE_FIREBASE_MESSAGING_SENDER_ID
  - VITE_FIREBASE_APP_ID
- [ ] Deploy successful (no build errors)
- [ ] App loads on public URL
- [ ] Login page appears
- [ ] Can create account
- [ ] Firebase connection works
- [ ] File uploads work on production

## ✅ Production Testing

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on iPhone and Android
- [ ] Create multiple test accounts
- [ ] Test all workflows end-to-end
- [ ] Test with different file types (PDF, DOCX, images, etc.)
- [ ] Test with different file sizes
- [ ] Verify all data appears correctly
- [ ] Check that grades/feedback save properly

## ✅ Security

- [ ] Firestore rules prevent unauthorized access
- [ ] Storage rules prevent unauthorized uploads
- [ ] Students can't see other students' profiles
- [ ] Students can't see other students' submissions
- [ ] Teachers can see all submissions
- [ ] Teachers can't be impersonated
- [ ] No sensitive data exposed in frontend code

## ✅ Performance

- [ ] Page loads in < 3 seconds
- [ ] File uploads are fast
- [ ] No lag when scrolling
- [ ] No memory leaks (check browser DevTools)
- [ ] Firebase quota usage is reasonable

## ✅ Backup & Recovery

- [ ] Have a backup of Firebase data
- [ ] Know how to restore data if needed
- [ ] Have admin access to Firebase console
- [ ] Know how to check Firebase logs

## ✅ Documentation

- [ ] README.md explains how to use the app
- [ ] FIREBASE_SETUP.md has setup instructions
- [ ] SECURITY_RULES.md explains security
- [ ] Know how to add new features
- [ ] Have contact info for support

## ✅ Launch

- [ ] All checkboxes above are checked ✅
- [ ] You've tested thoroughly
- [ ] You're confident in the app
- [ ] Share the public URL with students/teachers
- [ ] Monitor for issues in first week
- [ ] Be ready to fix bugs quickly

## Public URL After Deployment

Your app will be available at:
```
https://student-homework-app-yourname.vercel.app
```

(Replace `yourname` with your Vercel username)

## First Week Monitoring

- Monitor Firebase console for errors
- Check quota usage (should be low for 100 students)
- Collect user feedback
- Fix any bugs immediately
- Keep backups of all data

## Common Issues

If something goes wrong after launch:

1. **"Can't upload files"** → Check Storage rules
2. **"Can't create account"** → Check Authentication is enabled
3. **"Can't see assignments"** → Check Firestore rules
4. **"Wrong data appearing"** → Check database queries
5. **"Slow performance"** → Check Firebase quota

If stuck, refer back to:
- `FIREBASE_SETUP.md` - Setup instructions
- `SECURITY_RULES.md` - Security rules
- Firebase Console - Debug database and rules
- Browser Console - Check for JavaScript errors

## You're Ready! 🎉

Once all checkboxes are complete, your homework app is live and ready for students and teachers!
