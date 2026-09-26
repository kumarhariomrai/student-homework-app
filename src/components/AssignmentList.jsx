export default function AssignmentList({ assignments, submissions, onSelectAssignment, selectedAssignment }) {
  return (
    <div>
      <h3>Available Assignments</h3>
      {assignments.length === 0 ? (
        <div className="empty-state">No assignments yet.</div>
      ) : (
        <ul className="list">
          {assignments.map((item) => {
            const hasSubmitted = submissions.some((sub) => sub.assignmentId === item.id);
            return (
              <li
                key={item.id}
                className="list-item"
                onClick={() => onSelectAssignment(item.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: selectedAssignment === item.id ? '#eff6ff' : '#f8fafc',
                  borderColor: selectedAssignment === item.id ? '#2563eb' : 'var(--border)',
                }}
              >
                <div className="hstack">
                  <strong>{item.title}</strong>
                  {hasSubmitted && <span className="badge">✓ Submitted</span>}
                </div>
                <div className="muted">{item.description}</div>
                {item.dueDate && (
                  <div className="muted">
                    Due: {new Date(item.dueDate).toLocaleDateString()}
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
