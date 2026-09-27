import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function StudentDashboard({ uid, email, userName }) {
  const [grades, setGrades] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const gradesQuery = query(collection(db, 'grades'), where('studentId', '==', uid), orderBy('createdAt', 'desc'));
    const unsubGrades = onSnapshot(gradesQuery, (snapshot) => {
      setGrades(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const materialsQuery = query(collection(db, 'materials'), orderBy('createdAt', 'desc'));
    const unsubMaterials = onSnapshot(materialsQuery, (snapshot) => {
      setMaterials(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const noticesQuery = query(collection(db, 'notices'), orderBy('createdAt', 'desc'));
    const unsubNotices = onSnapshot(noticesQuery, (snapshot) => {
      setNotices(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubGrades();
      unsubMaterials();
      unsubNotices();
    };
  }, [uid]);

  const average = grades.length
    ? (grades.reduce((sum, item) => sum + Number(item.score || 0), 0) / grades.length).toFixed(1)
    : '0.0';

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Student portal</p>
          <h2>Welcome, {userName}</h2>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card card">
          <span>Average</span>
          <strong>{average}%</strong>
        </div>
        <div className="stat-card card">
          <span>Subjects</span>
          <strong>{new Set(grades.map((g) => g.subject)).size}</strong>
        </div>
        <div className="stat-card card">
          <span>Grade Entries</span>
          <strong>{grades.length}</strong>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card panel">
          <h3>Progress Tracker</h3>
          {grades.length === 0 ? (
            <div className="empty-state">No grades available yet.</div>
          ) : (
            <ul className="list">
              {grades.map((grade) => (
                <li key={grade.id} className="list-item">
                  <div className="hstack">
                    <strong>{grade.subject}</strong>
                    <span className="badge">{grade.score}%</span>
                  </div>
                  <div className="muted">{grade.remark || 'No remark provided yet.'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card panel">
          <h3>Download Center</h3>
          {materials.length === 0 ? (
            <div className="empty-state">No study materials available.</div>
          ) : (
            <ul className="list">
              {materials.map((item) => (
                <li key={item.id} className="list-item">
                  <div className="hstack">
                    <strong>{item.title}</strong>
                    <span className="badge">{item.type}</span>
                  </div>
                  <div className="muted">{item.description}</div>
                  {item.fileUrl && (
                    <a href={item.fileUrl} target="_blank" rel="noreferrer">
                      <button className="btn btn-secondary" style={{ marginTop: 8 }}>Download</button>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card panel" style={{ marginTop: 24 }}>
        <h3>Announcement Feed</h3>
        {notices.length === 0 ? (
          <div className="empty-state">No announcements yet.</div>
        ) : (
          <ul className="list">
            {notices.map((notice) => (
              <li key={notice.id} className="list-item notice-item">
                <div className="hstack">
                  <strong>{notice.title}</strong>
                </div>
                <div className="muted">{notice.content}</div>
                <div className="muted">Posted by {notice.createdByName}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
