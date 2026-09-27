import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export default function TeacherDashboard({ uid, email, userName }) {
  const [activeTab, setActiveTab] = useState('grades');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [notices, setNotices] = useState([]);
  const [gradeForm, setGradeForm] = useState({ studentId: '', subject: 'Math', score: '', remark: '' });
  const [materialForm, setMaterialForm] = useState({ title: '', description: '', type: 'PDF', file: null, fileName: '' });
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const studentQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubStudents = onSnapshot(studentQuery, (snapshot) => {
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    const gradesQuery = query(collection(db, 'grades'), orderBy('createdAt', 'desc'));
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
      unsubStudents();
      unsubGrades();
      unsubMaterials();
      unsubNotices();
    };
  }, []);

  const handleGradeSave = async (e) => {
    e.preventDefault();
    if (!gradeForm.studentId || !gradeForm.subject || !gradeForm.score) {
      setStatus('Please fill in student, subject, and score.');
      return;
    }

    try {
      await addDoc(collection(db, 'grades'), {
        studentId: gradeForm.studentId,
        studentName: students.find((s) => s.id === gradeForm.studentId)?.name || 'Student',
        subject: gradeForm.subject,
        score: Number(gradeForm.score),
        remark: gradeForm.remark || '',
        enteredBy: uid,
        enteredByName: userName,
        createdAt: serverTimestamp(),
      });

      setGradeForm({ studentId: '', subject: 'Math', score: '', remark: '' });
      setStatus('Grade saved successfully.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleMaterialUpload = async (e) => {
    e.preventDefault();
    if (!materialForm.title || !materialForm.file) {
      setStatus('Please add a title and select a file.');
      return;
    }

    try {
      const filePath = `materials/${Date.now()}_${materialForm.file.name}`;
      const fileRef = ref(storage, filePath);
      await uploadBytes(fileRef, materialForm.file);
      const fileUrl = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'materials'), {
        title: materialForm.title,
        description: materialForm.description,
        type: materialForm.type,
        fileName: materialForm.file.name,
        fileUrl,
        uploadedBy: uid,
        uploadedByName: userName,
        createdAt: serverTimestamp(),
      });

      setMaterialForm({ title: '', description: '', type: 'PDF', file: null, fileName: '' });
      setStatus('Material uploaded successfully.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const handleNoticePublish = async (e) => {
    e.preventDefault();
    if (!noticeForm.title || !noticeForm.content) {
      setStatus('Please add title and announcement text.');
      return;
    }

    try {
      await addDoc(collection(db, 'notices'), {
        title: noticeForm.title,
        content: noticeForm.content,
        createdBy: uid,
        createdByName: userName,
        createdAt: serverTimestamp(),
      });

      setNoticeForm({ title: '', content: '' });
      setStatus('Announcement published.');
    } catch (err) {
      setStatus(err.message);
    }
  };

  const getAverageForStudent = (studentId) => {
    const studentGrades = grades.filter((g) => g.studentId === studentId && Number.isFinite(Number(g.score)));
    if (!studentGrades.length) return '—';
    const total = studentGrades.reduce((sum, g) => sum + Number(g.score), 0);
    return `${(total / studentGrades.length).toFixed(1)}%`;
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Teacher control panel</p>
          <h2>Teacher Dashboard</h2>
        </div>
        <div className="tab-group">
          {['grades', 'materials', 'notices'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'grades' ? 'Grades' : tab === 'materials' ? 'Materials' : 'Notices'}
            </button>
          ))}
        </div>
      </div>

      {status && <div className="alert" style={{ marginBottom: 20 }}>{status}</div>}

      {activeTab === 'grades' && (
        <div className="dashboard-grid">
          <div className="card panel">
            <h3>Add Grade</h3>
            <form onSubmit={handleGradeSave} className="form-grid">
              <div>
                <label className="label">Student</label>
                <select
                  className="select"
                  value={gradeForm.studentId}
                  onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })}
                >
                  <option value="">Select student</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>{student.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">Subject</label>
                <input
                  className="input"
                  value={gradeForm.subject}
                  onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })}
                  placeholder="Math, English, Science"
                />
              </div>

              <div>
                <label className="label">Score (%)</label>
                <input
                  className="input"
                  type="number"
                  min="0"
                  max="100"
                  value={gradeForm.score}
                  onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })}
                  placeholder="85"
                />
              </div>

              <div>
                <label className="label">Remark</label>
                <textarea
                  className="textarea"
                  value={gradeForm.remark}
                  onChange={(e) => setGradeForm({ ...gradeForm, remark: e.target.value })}
                  placeholder="Good work, need improvement in algebra..."
                />
              </div>

              <button className="btn btn-primary" type="submit">Save Grade</button>
            </form>
          </div>

          <div className="card panel">
            <h3>Student Performance</h3>
            {students.length === 0 ? (
              <div className="empty-state">No students yet.</div>
            ) : (
              <ul className="list">
                {students.map((student) => (
                  <li key={student.id} className="list-item">
                    <div className="hstack">
                      <strong>{student.name}</strong>
                      <span className="badge">Avg: {getAverageForStudent(student.id)}</span>
                    </div>
                    <div className="muted">{student.email}</div>
                    <div className="muted">Recent scores: {grades.filter((g) => g.studentId === student.id).slice(0, 3).map((g) => `${g.subject}: ${g.score}`).join(' • ') || 'No grades yet'}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="dashboard-grid">
          <div className="card panel">
            <h3>Upload Study Material</h3>
            <form onSubmit={handleMaterialUpload} className="form-grid">
              <div>
                <label className="label">Title</label>
                <input
                  className="input"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
                  placeholder="Lecture Notes - Chapter 3"
                />
              </div>

              <div>
                <label className="label">Type</label>
                <select
                  className="select"
                  value={materialForm.type}
                  onChange={(e) => setMaterialForm({ ...materialForm, type: e.target.value })}
                >
                  <option value="PDF">PDF</option>
                  <option value="Lecture">Lecture</option>
                  <option value="Slides">Slides</option>
                  <option value="Homework">Homework</option>
                </select>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  className="textarea"
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
                  placeholder="Explain what the file contains"
                />
              </div>

              <div>
                <label className="label">Choose File</label>
                <input
                  className="input"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMaterialForm({ ...materialForm, file, fileName: file.name });
                    }
                  }}
                />
                {materialForm.fileName && <div className="muted" style={{ marginTop: 6 }}>Selected: {materialForm.fileName}</div>}
              </div>

              <button className="btn btn-primary" type="submit">Upload Material</button>
            </form>
          </div>

          <div className="card panel">
            <h3>Shared Materials</h3>
            {materials.length === 0 ? (
              <div className="empty-state">No materials uploaded yet.</div>
            ) : (
              <ul className="list">
                {materials.map((item) => (
                  <li key={item.id} className="list-item">
                    <div className="hstack">
                      <strong>{item.title}</strong>
                      <span className="badge">{item.type}</span>
                    </div>
                    <div className="muted">{item.description}</div>
                    <div className="muted">File: {item.fileName}</div>
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
      )}

      {activeTab === 'notices' && (
        <div className="dashboard-grid">
          <div className="card panel">
            <h3>Publish Notice</h3>
            <form onSubmit={handleNoticePublish} className="form-grid">
              <div>
                <label className="label">Title</label>
                <input
                  className="input"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Exam date reminder"
                />
              </div>

              <div>
                <label className="label">Message</label>
                <textarea
                  className="textarea"
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Write your notice here..."
                />
              </div>

              <button type="submit" className="btn btn-primary">Publish Notice</button>
            </form>
          </div>

          <div className="card panel">
            <h3>Announcement Feed</h3>
            {notices.length === 0 ? (
              <div className="empty-state">No notices posted yet.</div>
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
      )}
    </div>
  );
}
