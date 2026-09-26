import { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import AssignmentList from '../components/AssignmentList';
import SubmissionPanel from '../components/SubmissionPanel';

export default function StudentDashboard({ uid, email, userName }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [filteredAssignments, setFilteredAssignments] = useState([]);

  useEffect(() => {
    // Listen for assignments
    const assignmentQuery = query(collection(db, 'assignments'), orderBy('createdAt', 'desc'));
    const unsubscribeAssignments = onSnapshot(assignmentQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssignments(data);
      setFilteredAssignments(data);
    });

    // Listen for this student's submissions
    const submissionQuery = query(
      collection(db, 'submissions'),
      where('studentId', '==', uid),
      orderBy('submittedAt', 'desc')
    );
    const unsubscribeSubmissions = onSnapshot(submissionQuery, (snapshot) => {
      setSubmissions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeAssignments();
      unsubscribeSubmissions();
    };
  }, [uid]);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedAssignment || !file) {
      setError('Please select an assignment and choose a file.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.');
      return;
    }

    try {
      setLoading(true);
      const assignment = assignments.find((item) => item.id === selectedAssignment);

      const fileExtension = file.name.split('.').pop();
      const storagePath = `submissions/${uid}/${selectedAssignment}/${Date.now()}.${fileExtension}`;
      const fileRef = ref(storage, storagePath);

      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'submissions'), {
        assignmentId: selectedAssignment,
        assignmentTitle: assignment?.title || 'Homework',
        studentId: uid,
        studentName: userName,
        studentEmail: email,
        fileName: file.name,
        fileUrl: url,
        submittedAt: serverTimestamp(),
        status: 'submitted',
        grade: null,
        feedback: '',
      });

      setFile(null);
      setFileName('');
      setSelectedAssignment('');
      setError('');
    } catch (err) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const hasSubmitted = (assignmentId) => {
    return submissions.some((sub) => sub.assignmentId === assignmentId);
  };

  const getSubmissionForAssignment = (assignmentId) => {
    return submissions.find((sub) => sub.assignmentId === assignmentId);
  };

  return (
    <div className="page">
      <div className="card form-card">
        <h2>📝 Submit Your Work</h2>
        <p className="muted" style={{ marginBottom: 16 }}>
          Upload your completed homework here.
        </p>

        {error && <div className="alert" style={{ backgroundColor: '#fee', color: '#991', marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleUpload} className="form-grid">
          <div>
            <label className="label">Select Assignment</label>
            <select
              className="select"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              required
            >
              <option value="">Choose an assignment...</option>
              {filteredAssignments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.title} {hasSubmitted(item.id) ? '✓' : ''}
                </option>
              ))}
            </select>
          </div>

          {selectedAssignment && (
            <div className="list-item">
              <strong>{assignments.find((a) => a.id === selectedAssignment)?.title}</strong>
              <div className="muted">{assignments.find((a) => a.id === selectedAssignment)?.description}</div>
              {assignments.find((a) => a.id === selectedAssignment)?.dueDate && (
                <div className="muted">
                  Due: {new Date(assignments.find((a) => a.id === selectedAssignment)?.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="label">Upload Your Answer File</label>
            <input
              className="input"
              type="file"
              onChange={(e) => {
                const selectedFile = e.target.files?.[0];
                if (selectedFile) {
                  setFile(selectedFile);
                  setFileName(selectedFile.name);
                }
              }}
              required
            />
            {fileName && <div className="muted" style={{ fontSize: '0.88rem', marginTop: 6 }}>Selected: {fileName}</div>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '📤 Uploading...' : '📤 Upload Homework'}
          </button>
        </form>
      </div>

      <SubmissionPanel submissions={submissions} assignments={assignments} />
    </div>
  );
}
