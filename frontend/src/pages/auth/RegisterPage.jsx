import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

/* ── tiny field primitive ──────────────────────────────────────── */
function Field({ label, half, children }) {
  return (
    <div style={{ gridColumn: half ? 'span 1' : 'span 2', display: 'flex', flexDirection: 'column', gap: 5 }}>
      <span
        style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: 'var(--txt3)',
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

/* ── diet preference radio-pills ───────────────────────────────── */
const DIET_OPTIONS = [
  { value: 'VEG',     label: 'Vegetarian',     dot: 'var(--leaf)' },
  { value: 'NON_VEG', label: 'Non-Veg',         dot: 'var(--rose)' },
  { value: 'VEGAN',   label: 'Vegan',           dot: 'var(--amber)' },
];

function DietPicker({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {DIET_OPTIONS.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 'var(--r-full)',
              border: `1.5px solid ${active ? o.dot : 'var(--border)'}`,
              background: active ? 'var(--surface)' : 'transparent',
              color: active ? o.dot : 'var(--txt3)',
              fontSize: '0.8rem',
              fontWeight: active ? 700 : 500,
              cursor: 'pointer',
              transition: 'all var(--dur-f)',
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: o.dot, flexShrink: 0, display: 'inline-block' }} />
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── brand panel (shared with login) ───────────────────────────── */
function BrandPanel() {
  return (
    <div className="auth-card-brand">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="sidebar-logo-icon" style={{ width: 44, height: 44, fontSize: '1.5rem' }}>
          🍱
        </div>
        <div>
          <div className="sidebar-logo-text" style={{ fontSize: '1.05rem' }}>TiffinTrack</div>
          <div className="sidebar-logo-sub">Campus Mess Portal</div>
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--sidebar-txt)', lineHeight: 1.6 }}>
          Join your hostel's mess management system. Fill in your details once — manage orders, attendance, and more from any device.
        </p>
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
        {['📋  Profile & Aadhaar verified', '📦  Order meals ahead of time', '✅  View attendance history'].map((f) => (
          <li key={f} style={{ fontSize: '0.78rem', color: 'var(--sidebar-txt)' }}>{f}</li>
        ))}
      </ul>
    </div>
  );
}

/* ── group heading inside the form ─────────────────────────────── */
function GroupHeading({ children }) {
  return (
    <div
      style={{
        gridColumn: 'span 2',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingTop: 4,
        paddingBottom: 2,
        borderBottom: '1px solid var(--border)',
        marginTop: 4,
      }}
    >
      <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--txt3)' }}>
        {children}
      </span>
    </div>
  );
}

/* ── main component ─────────────────────────────────────────────── */
function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { success, error } = useNotification();

  const [loading, setLoading] = useState(false);
  const [fieldErr, setFieldErr] = useState('');
  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    enrollmentNumber: '',
    hostelBlock: '',
    roomNumber: '',
    aadhaarNumber: '',
    dietPreference: 'VEG',
  });

  const set = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setFieldErr('');
    setLoading(true);
    try {
      const data = await authService.register({ ...form, email: form.email.trim() });
      login(data.token, {
        id: data.userId,
        role: data.role,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
      success('Account created! Welcome aboard 🎉');
      navigate('/student', { replace: true });
    } catch (err) {
      setFieldErr(err?.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page" style={{ alignItems: 'flex-start', paddingTop: 32, paddingBottom: 32 }}>
      <section
        className="auth-card"
        style={{ width: 'min(680px, 100%)', gridTemplateColumns: '190px 1fr' }}
      >
        <BrandPanel />

        {/* ── form side ── */}
        <div className="auth-card-form" style={{ overflowY: 'auto', maxHeight: '92vh' }}>
          {/* heading */}
          <div>
            <h1 style={{ fontFamily: 'var(--font-d)', fontSize: '1.3rem', fontWeight: 600, color: 'var(--txt1)', marginBottom: 4 }}>
              Create your account
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--txt3)' }}>
              Register as a hostel student — takes under two minutes.
            </p>
          </div>

          {/* error */}
          {fieldErr && (
            <div className="alert alert-error" style={{ marginBottom: 0 }}>
              <span>⚠</span>
              <span style={{ flex: 1 }}>{fieldErr}</span>
            </div>
          )}

          {/* ── form grid ── */}
          <form
            onSubmit={submit}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }}
          >
            {/* personal */}
            <GroupHeading>Personal details</GroupHeading>

            <Field label="First name" half>
              <input
                value={form.firstName}
                onChange={set('firstName')}
                placeholder="Aarav"
                required
              />
            </Field>
            <Field label="Last name" half>
              <input
                value={form.lastName}
                onChange={set('lastName')}
                placeholder="Sharma"
                required
              />
            </Field>
            <Field label="Email address">
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@campus.edu"
                required
                autoComplete="email"
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Min. 8 characters"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </Field>
            <Field label="Phone" half>
              <input
                value={form.phone}
                onChange={set('phone')}
                placeholder="9876543210"
                type="tel"
              />
            </Field>
            <Field label="Enrollment number" half>
              <input
                value={form.enrollmentNumber}
                onChange={set('enrollmentNumber')}
                placeholder="21CSE001"
                required
              />
            </Field>

            {/* hostel */}
            <GroupHeading>Hostel & room</GroupHeading>

            <Field label="Hostel block" half>
              <input
                value={form.hostelBlock}
                onChange={set('hostelBlock')}
                placeholder="Block A"
              />
            </Field>
            <Field label="Room number" half>
              <input
                value={form.roomNumber}
                onChange={set('roomNumber')}
                placeholder="A-204"
              />
            </Field>
            <Field label="Aadhaar number">
              <input
                value={form.aadhaarNumber}
                onChange={set('aadhaarNumber')}
                placeholder="1234 5678 9012"
                maxLength={14}
              />
            </Field>

            {/* diet */}
            <GroupHeading>Diet preference</GroupHeading>

            <div style={{ gridColumn: 'span 2' }}>
              <DietPicker
                value={form.dietPreference}
                onChange={(v) => setForm((p) => ({ ...p, dietPreference: v }))}
              />
            </div>

            {/* submit */}
            <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
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
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background var(--dur-f)',
                }}
              >
                {loading ? 'Creating account…' : 'Create account →'}
              </button>
            </div>
          </form>

          {/* footer */}
          <p style={{ fontSize: '0.8rem', color: 'var(--txt3)', textAlign: 'center', marginTop: 4 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--sf)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;