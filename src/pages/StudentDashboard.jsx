import { useEffect, useState } from 'react';
import { addDoc, collection, getDocs, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export default function StudentDashboard({ uid, email }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const assignmentQuery = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    const unsubscribeAssignments = onSnapshot(assignmentQuery, (snapshot) => {
      setAssignments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const submissionQuery = query(collection(db, 'submissions'), where('studentId', '==', uid));
    const unsubscribeSubmissions = onSnapshot(submissionQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [uid]);

  const handleUpload = async () => {
    if (!selectedAssignment || !file) {
      alert('Please select an assignment and file.');
      return;
    }

    try {
      setLoading(true);
      const assignment = assignments.find((item) => item.id === selectedAssignment);
      const fileRef = ref(storage, `submissions/${uid}/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'submissions'), {
        assignmentId: selectedAssignment,
        assignmentTitle: assignment?.title || 'Homework',
        studentId: uid,
        studentEmail: email,
        fileName: file.name,
        fileUrl: url,
        submittedAt: serverTimestamp(),
        status: 'submitted',
      });

      alert('Homework submitted successfully.');
      setFile(null);
      setSelectedAssignment('');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="card form-card">
        <h2>Submit Homework</h2>
        <div className="form-grid">
          <div>
            <label className="label">Choose Assignment</label>
            <select className="select" value={selectedAssignment} onChange={(e) => setSelectedAssignment(e.target.value)}>
              <option value="">Select an assignment</option>
              {assignments.map((item) => (
                <option key={item.id} value={item.id}>{item.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Upload answer file</label>
            <input className="input" type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          <button className="btn btn-primary" onClick={handleUpload} disabled={loading}>
            {loading ? 'Submitting...' : 'Upload Homework'}
          </button>
        </div>
      </div>

      <div className="card panel">
        <h2>Your Submissions</h2>
        {submissions.length === 0 ? (
          <div className="empty-state">No submissions yet.</div>
        ) : (
          <ul className="list">
            {submissions.map((item) => (
              <li key={item.id} className="list-item">
                <div className="hstack">
                  <strong>{item.assignmentTitle}</strong>
                  <span className="badge">{item.status}</span>
                </div>
                <div className="muted">{item.fileName}</div>
                <div className="muted">{new Date(item.submittedAt?.seconds * 1000 || Date.now()).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
