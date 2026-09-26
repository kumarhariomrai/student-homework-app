import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function TeacherDashboard({ uid, email, userName }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedAssignment, setExpandedAssignment] = useState(null);
  const [gradeData, setGradeData] = useState({});

  useEffect(() => {
    const assignmentsQuery = query(
      collection(db, 'assignments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeAssignments = onSnapshot(assignmentsQuery, (snapshot) => {
      setAssignments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const submissionsQuery = query(
      collection(db, 'submissions'),
      orderBy('submittedAt', 'desc')
    );
    const unsubscribeSubmissions = onSnapshot(submissionsQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title.trim() || !description.trim()) {
      setError('Please enter both title and description.');
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(db, 'assignments'), {
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        createdBy: uid,
        createdByName: userName,
        createdByEmail: email,
        createdAt: serverTimestamp(),
      });

      setTitle('');
      setDescription('');
      setDueDate('');
      setSuccess('✓ Assignment created successfully!');
    } catch (err) {
      setError(`Failed to create assignment: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await deleteDoc(doc(db, 'assignments', assignmentId));
      setSuccess('Assignment deleted.');
    } catch (err) {
      setError(`Failed to delete: ${err.message}`);
    }
  };

  const handleGradeSubmission = async (submissionId, grade, feedback) => {
    try {
      await updateDoc(doc(db, 'submissions', submissionId), {
        grade,
        feedback,
        status: 'graded',
      });
      setSuccess('✓ Grade saved!');
      setGradeData({});
    } catch (err) {
      setError(`Failed to save grade: ${err.message}`);
    }
  };

  const getSubmissionsForAssignment = (assignmentId) => {
    return submissions.filter((sub) => sub.assignmentId === assignmentId);
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date() > new Date(dueDate);
  };

  return (
    <div className="page">
      <div className="card form-card">
        <h2>📚 Create Assignment</h2>
        <p className="muted" style={{ marginBottom: 16 }}>
          Create homework for your students.
        </p>

        {error && <div className="alert" style={{ backgroundColor: '#fee', color: '#991', marginBottom: 16 }}>{error}</div>}
        {success && <div className="alert" style={{ marginBottom: 16 }}>{success}</div>}

        <form onSubmit={handleCreateAssignment} className="form-grid">
          <div className="row">
            <div>
              <label className="label">Title</label>
              <input
                className="input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Math Homework 5"
                required
              />
            </div>

            <div>
              <label className="label">Due Date (Optional)</label>
              <input
                className="input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain what students need to do..."
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : '+ Create Assignment'}
          </button>
        </form>

        <hr style={{ margin: '32px 0', border: 'none', borderTop: '1px solid var(--border)' }} />

        <h3>Your Assignments</h3>
        {assignments.length === 0 ? (
          <div className="empty-state">No assignments yet. Create one above.</div>
        ) : (
          <ul className="list">
            {assignments.map((item) => (
              <li key={item.id} className="list-item">
                <div className="hstack">
                  <div>
                    <strong>{item.title}</strong>
                    {item.dueDate && isOverdue(item.dueDate) && <span className="badge" style={{ marginLeft: 8, backgroundColor: '#fee', color: '#991' }}>Overdue</span>}
                  </div>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteAssignment(item.id)}
                  >
                    Delete
                  </button>
                </div>
                <div className="muted" style={{ marginTop: 6 }}>{item.description}</div>
                {item.dueDate && (
                  <div className="muted" style={{ marginTop: 6 }}>Due: {new Date(item.dueDate).toLocaleDateString()}</div>
                )}
                <div className="muted" style={{ marginTop: 6 }}>
                  {getSubmissionsForAssignment(item.id).length} submission(s)
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card panel">
        <h2>📥 Student Submissions</h2>
        {submissions.length === 0 ? (
          <div className="empty-state">No submissions yet.</div>
        ) : (
          <ul className="list">
            {submissions.map((item) => (
              <li key={item.id} className="list-item">
                <div className="hstack">
                  <div>
                    <strong>{item.assignmentTitle || 'Homework'}</strong>
                    <span className="badge" style={{ marginLeft: 8 }}>{item.status}</span>
                  </div>
                </div>
                <div className="muted">📧 {item.studentName} ({item.studentEmail})</div>
                <div className="muted">📄 {item.fileName}</div>
                <div className="muted">⏰ {new Date(item.submittedAt?.seconds * 1000 || Date.now()).toLocaleString()}</div>

                {item.fileUrl && (
                  <a href={item.fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: 8 }}>
                    <button className="btn btn-secondary">📖 View File</button>
                  </a>
                )}

                {expandedAssignment !== item.id && (
                  <button
                    className="btn btn-secondary"
                    onClick={() => setExpandedAssignment(item.id)}
                    style={{ marginLeft: 6, marginTop: 8 }}
                  >
                    Grade
                  </button>
                )}

                {expandedAssignment === item.id && (
                  <div style={{ marginTop: 12, padding: 12, backgroundColor: '#f8fafc', borderRadius: 8 }}>
                    <div>
                      <label className="label">Grade</label>
                      <input
                        className="input"
                        type="text"
                        placeholder="e.g., A+, 95/100"
                        defaultValue={item.grade || ''}
                        onChange={(e) => setGradeData({ ...gradeData, grade: e.target.value })}
                      />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <label className="label">Feedback</label>
                      <textarea
                        className="textarea"
                        placeholder="Add feedback for the student..."
                        defaultValue={item.feedback || ''}
                        onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
                        style={{ minHeight: 80 }}
                      />
                    </div>
                    <div className="form-actions" style={{ marginTop: 8 }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleGradeSubmission(item.id, gradeData.grade || '', gradeData.feedback || '')}
                      >
                        Save Grade
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => setExpandedAssignment(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
