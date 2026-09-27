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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignup) {
        if (!name.trim()) {
          throw new Error('Name is required.');
        }

        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          name,
          email,
          role,
          createdAt: new Date().toISOString(),
        });
        setSuccess(`Account created! Welcome, ${name}.`);
        setName('');
        setEmail('');
        setPassword('');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess('Logged in successfully!');
      }
    } catch (err) {
      let errorMsg = err.message;
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already in use.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/user-not-found') {
        errorMsg = 'No account found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errorMsg = 'Incorrect password.';
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <div className="card login-card">
        <div className="logo-wrap">
          <img src="/logo.svg" alt="Sunbeam Convent School logo" className="brand-logo" />
        </div>
        <h1 className="login-title">Sunbeam Convent School</h1>
        <p className="login-subtitle">Teacher, student, and parent portal.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert">{success}</div>}

        <form onSubmit={handleAuth} className="form-grid">
          {isSignup && (
            <>
              <div>
                <label className="label">Full Name</label>
                <input
                  className="input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="label">Role</label>
                <select className="select" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="label">Email Address</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : isSignup ? 'Create Account' : 'Sign In'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setIsSignup(!isSignup);
                setError('');
                setSuccess('');
              }}
            >
              {isSignup ? 'Already have an account?' : 'Need an account?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
