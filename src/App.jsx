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
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setUserRole(userData.role || 'student');
            setUserName(userData.name || 'User');
          } else {
            setUserRole('student');
            setUserName('User');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setUserRole('student');
          setUserName('User');
        }
      } else {
        setUserRole(null);
        setUserName('');
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="login-wrap">
        <div className="card login-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>📚</div>
          <h2>Loading...</h2>
          <p className="muted">Initializing your homework portal</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="app-shell">
      <div className="container">
        <header className="card topbar">
          <div className="brand">📚 Homework Portal</div>
          <div className="header-actions">
            <span className="user-pill">
              {userRole === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'} • {userName}
            </span>
            <button className="btn btn-secondary" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        </header>

        {userRole === 'teacher' ? (
          <TeacherDashboard uid={user.uid} email={user.email} userName={userName} />
        ) : (
          <StudentDashboard uid={user.uid} email={user.email} userName={userName} />
        )}
      </div>
    </div>
  );
}
