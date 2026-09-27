@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

:root {
  --bg: #f5f7fb;
  --card: #ffffff;
  --primary: #2563eb;
  --primary-dark: #1d4ed8;
  --success: #16a34a;
  --text: #0f172a;
  --muted: #475569;
  --border: #dfe7f5;
  --danger: #dc2626;
  --warning: #f59e0b;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #eef4ff 0%, #f8fafc 100%);
  color: var(--text);
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
select,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 32px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  margin-bottom: 24px;
}

.brand {
  font-size: 1.4rem;
  font-weight: 800;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-pill {
  background: #eff6ff;
  color: var(--primary-dark);
  border-radius: 999px;
  padding: 8px 14px;
  font-weight: 600;
  font-size: 0.92rem;
}

.btn {
  border: none;
  cursor: pointer;
  border-radius: 12px;
  padding: 12px 18px;
  font-weight: 700;
  transition: 0.2s ease;
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.btn-secondary {
  background: #e2e8f0;
  color: var(--text);
}

.btn-danger {
  background: var(--danger);
  color: white;
}

.page {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 24px;
}

.form-card,
.panel {
  padding: 24px;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.label {
  display: block;
  font-size: 0.86rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: var(--muted);
}

.input,
.select,
.textarea {
  width: 100%;
  border: 1px solid var(--border);
  background: #fbfdff;
  color: var(--text);
  border-radius: 12px;
  padding: 12px 14px;
  outline: none;
}

.input:focus,
.select:focus,
.textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.textarea {
  min-height: 110px;
  resize: vertical;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 12px;
}

.list-item {
  background: #f8fafc;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
}

.hstack {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.muted {
  color: var(--muted);
}

.badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: #ecfdf5;
  color: #166534;
}

.empty-state {
  background: #f8fafc;
  border: 1px dashed var(--border);
  border-radius: 12px;
  padding: 16px;
  color: var(--muted);
}

.alert {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 600;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border-color: #fecaca;
}

.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: min(460px, 100%);
  padding: 28px;
}

.login-title {
  margin: 0 0 6px;
  font-size: 2rem;
}

.login-subtitle {
  margin: 0 0 20px;
  color: var(--muted);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.dashboard-shell {
  display: grid;
  gap: 24px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.eyebrow {
  margin: 0 0 8px;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: var(--primary);
  font-size: 0.72rem;
}

.dashboard-header h2 {
  margin: 0;
  font-size: 2rem;
}

.tab-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tab-btn {
  border: 1px solid var(--border);
  background: white;
  color: var(--text);
  border-radius: 999px;
  padding: 9px 16px;
  font-weight: 700;
  cursor: pointer;
}

.tab-btn.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.stat-card {
  padding: 20px 18px;
  display: grid;
  gap: 8px;
}

.stat-card span {
  color: var(--muted);
  font-size: 0.9rem;
}

.stat-card strong {
  font-size: 1.8rem;
}

.notice-item {
  border-left: 4px solid var(--warning);
}

@media (max-width: 900px) {
  .dashboard-grid,
  .page,
  .stat-grid,
  .row {
    grid-template-columns: 1fr;
  }

  .topbar,
  .dashboard-header {
    display: grid;
    gap: 12px;
    align-items: start;
  }

  .header-actions,
  .form-actions {
    flex-wrap: wrap;
  }
}

