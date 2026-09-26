import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userRef);
        setUserRole(userSnap.exists() ? userSnap.data().role : 'student');
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="login-wrap"><div className="card login-card">Loading...</div></div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="card topbar">
          <div className="brand">Homework Portal</div>
          <div className="header-actions">
            <span className="user-pill">{userRole === 'teacher' ? 'Teacher' : 'Student'}</span>
            <button className="btn btn-secondary" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        </header>

        {userRole === 'teacher' ? <TeacherDashboard uid={user.uid} email={user.email} /> : <StudentDashboard uid={user.uid} email={user.email} />}
      </div>
    </div>
  );
}
