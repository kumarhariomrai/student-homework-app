import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import LoginPage from './pages/LoginPage';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import ParentDashboard from './pages/ParentDashboard';

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
          <div className="logo-wrap large">
            <img src="/logo.svg" alt="Sunbeam Convent School logo" className="brand-logo" />
          </div>
          <h2>Loading...</h2>
          <p className="muted">Initializing Sunbeam Convent School portal</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const roleLabel = userRole === 'teacher' ? 'Teacher' : userRole === 'parent' ? 'Parent' : 'Student';

  return (
    <div className="app-shell">
      <div className="container">
        <header className="card topbar">
          <div className="brand-wrap">
            <img src="/logo.svg" alt="Sunbeam Convent School logo" className="brand-logo" />
            <div className="brand-text">
              <div className="brand-name">Sunbeam Convent School</div>
              <div className="brand-subtitle">Learning Portal</div>
            </div>
          </div>
          <div className="header-actions">
            <span className="user-pill">
              {roleLabel} • {userName}
            </span>
            <button className="btn btn-secondary" onClick={() => signOut(auth)}>
              Logout
            </button>
          </div>
        </header>

        {userRole === 'teacher' && (
          <TeacherDashboard uid={user.uid} email={user.email} userName={userName} />
        )}

        {userRole === 'student' && (
          <StudentDashboard uid={user.uid} email={user.email} userName={userName} />
        )}

        {userRole === 'parent' && (
          <ParentDashboard uid={user.uid} email={user.email} userName={userName} />
        )}
      </div>
    </div>
  );
}
