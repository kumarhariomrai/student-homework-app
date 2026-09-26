export default function SubmissionPanel({ submissions, assignments }) {
  return (
    <div>
      <h2>📤 Your Submissions</h2>
      {submissions.length === 0 ? (
        <div className="empty-state">No submissions yet.</div>
      ) : (
        <ul className="list">
          {submissions.map((item) => {
            const assignment = assignments.find((a) => a.id === item.assignmentId);
            return (
              <li key={item.id} className="list-item">
                <div className="hstack">
                  <strong>{item.assignmentTitle}</strong>
                  <span className="badge" style={{
                    backgroundColor: item.status === 'graded' ? '#dcfce7' : '#ecfdf5',
                    color: item.status === 'graded' ? '#166534' : '#166534',
                  }}>
                    {item.status === 'graded' ? `✓ Graded: ${item.grade}` : '✓ Submitted'}
                  </span>
                </div>
                <div className="muted">📄 {item.fileName}</div>
                <div className="muted">⏰ {new Date(item.submittedAt?.seconds * 1000 || Date.now()).toLocaleString()}</div>
                {item.feedback && (
                  <div style={{ marginTop: 8, padding: 10, backgroundColor: '#fef3c7', borderRadius: 6 }}>
                    <strong>Teacher Feedback:</strong>
                    <p style={{ margin: '6px 0 0 0' }}>{item.feedback}</p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
