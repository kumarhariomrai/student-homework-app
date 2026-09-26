import { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    try {
      setLoading(true);
      setMessage('');

      if (isSignup) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name: name || 'New User',
          email,
          role,
          createdAt: new Date().toISOString(),
        });
        setMessage('Account created successfully.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('Login successful.');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <h1 className="login-title">Homework Portal</h1>
        <p className="login-subtitle">Teacher and student access in one place.</p>

        {message && <div className="alert">{message}</div>}

        <div className="form-grid">
          {isSignup && (
            <>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
              </div>
              <div>
                <label className="label">Role</label>
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>

          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleAuth} disabled={loading}>
              {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
            </button>
            <button className="btn btn-secondary" onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Already have account?' : 'Create account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
