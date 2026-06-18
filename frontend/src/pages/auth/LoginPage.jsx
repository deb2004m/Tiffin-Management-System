import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

/* ── small helpers that live only in this file ─────────────────── */
function BrandPanel() {
  return (
    <div className="auth-card-brand">
      {/* logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="sidebar-logo-icon" style={{ width: 44, height: 44, fontSize: '1.5rem' }}>
          🍱
        </div>
        <div>
          <div className="sidebar-logo-text" style={{ fontSize: '1.05rem' }}>TiffinTrack</div>
          <div className="sidebar-logo-sub">Campus Mess Portal</div>
        </div>
      </div>

      {/* feature list */}
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        {[
          '📅  Weekly menu explorer',
          '📦  Track orders live',
          '✅  Attendance records',
          '🔒  Secure & verified',
        ].map((f) => (
          <li key={f} style={{ fontSize: '0.78rem', color: 'var(--sidebar-txt)', lineHeight: 1.4 }}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <span
      style={{
        display: 'block',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: 'var(--txt3)',
        marginBottom: 5,
      }}
    >
      {children}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────── */
function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useNotification();

  const [form, setForm] = useState({ email: '', password: '', role: 'STUDENT' });
  const [loading, setLoading] = useState(false);
  const [fieldErr, setFieldErr] = useState('');

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFieldErr('');
    setLoading(true);
    try {
      const data = await authService.login({ email: form.email.trim(), password: form.password });

      if (data.role !== form.role) {
        setFieldErr(`This account is a ${data.role} — please choose the correct role.`);
        setLoading(false);
        return;
      }

      login(data.token, {
        id: data.userId,
        role: data.role,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      success('Welcome back! 👋');
      navigate(data.role === 'ADMIN' ? '/admin' : '/student', { replace: true });
    } catch (err) {
      setFieldErr(err?.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      {/* ── card: brand strip + form ── */}
      <section className="auth-card" style={{ width: 'min(580px, 100%)', gridTemplateColumns: '200px 1fr' }}>

        <BrandPanel />

        {/* ── form side ── */}
        <div className="auth-card-form">
          {/* heading */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--txt1)', marginBottom: 4 }}>
              Welcome back
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--txt3)' }}>
              Sign in to your mess portal
            </p>
          </div>

          {/* role tabs */}
          <div className="tabs">
            {['STUDENT', 'ADMIN'].map((r) => (
              <button
                key={r}
                type="button"
                className={`tab-btn${form.role === r ? ' active' : ''}`}
                onClick={() => setForm((p) => ({ ...p, role: r }))}
              >
                {r === 'STUDENT' ? '🎓 Student' : '🛠 Admin'}
              </button>
            ))}
          </div>

          {/* error banner */}
          {fieldErr && (
            <div className="alert alert-error" style={{ marginBottom: 0 }}>
              <span>⚠</span>
              <span>{fieldErr}</span>
            </div>
          )}

          {/* form fields */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Email address">
              <input
                type="email"
                placeholder="you@campus.edu"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
              />
            </Field>

            <Field label="Password">
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="current-password"
              />
            </Field>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                background: loading ? 'var(--border-dk)' : 'var(--sf)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--r-sm)',
                fontSize: '0.9375rem',
                fontWeight: 700,
                marginTop: 2,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background var(--dur-f)',
              }}
            >
              {loading ? 'Signing in…' : `Sign in as ${form.role === 'ADMIN' ? 'Admin' : 'Student'} →`}
            </button>
          </form>

          {/* footer */}
          <p style={{ fontSize: '0.8rem', color: 'var(--txt3)', textAlign: 'center' }}>
            New student?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--sf)', fontWeight: 700 }}
            >
              Create an account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;