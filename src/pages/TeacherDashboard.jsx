import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function TeacherDashboard({ uid, email }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const assignmentsQuery = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      setAssignments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const submissionsQuery = query(collection(db, 'submissions'), orderBy('submittedAt', 'desc'));
    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, []);

  const handleCreateAssignment = async () => {
    if (!title.trim() || !description.trim()) {
      alert('Please enter assignment title and description.');
      return;
    }

    await addDoc(collection(db, 'assignments'), {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      createdBy: uid,
      createdByEmail: email,
      createdAt: serverTimestamp(),
    });

    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const handleDeleteAssignment = async (assignmentId) => {
    await deleteDoc(doc(db, 'assignments', assignmentId));
  };

  return (
    <div className="page">
      <div className="card form-card">
        <h2>Create Assignment</h2>
        <div className="form-grid">
          <div>
            <label className="label">Assignment Title</label>
            <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Math Homework 1" />
          </div>

          <div>
            <label className="label">Due Date</label>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the homework" />
          </div>

          <button className="btn btn-primary" onClick={handleCreateAssignment}>Create Assignment</button>
        </div>

        <div style={{ marginTop: 32 }}>
          <h3>Assignments</h3>
          {assignments.length === 0 ? (
            <div className="empty-state">No assignments created yet.</div>
          ) : (
            <ul className="list">
              {assignments.map((item) => (
                <li key={item.id} className="list-item">
                  <div className="hstack">
                    <strong>{item.title}</strong>
                    <button className="btn btn-danger" onClick={() => handleDeleteAssignment(item.id)}>Delete</button>
                  </div>
                  <div className="muted">{item.description}</div>
                  {item.dueDate && <div className="muted">Due: {new Date(item.dueDate).toLocaleDateString()}</div>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="card panel">
        <h2>Student Submissions</h2>
        {submissions.length === 0 ? (
          <div className="empty-state">No submissions received yet.</div>
        ) : (
          <ul className="list">
            {submissions.map((item) => (
              <li key={item.id} className="list-item">
                <div className="hstack">
                  <strong>{item.assignmentTitle || 'Homework'}</strong>
                  <span className="badge">{item.status}</span>
                </div>
                <div className="muted">Student: {item.studentEmail}</div>
                <div className="muted">File: {item.fileName}</div>
                <div className="muted">Submitted:{' '}{new Date(item.submittedAt?.seconds * 1000 || Date.now()).toLocaleString()}</div>
                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer">
                    <button className="btn btn-secondary" style={{ marginTop: 8 }}>Open File</button>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
