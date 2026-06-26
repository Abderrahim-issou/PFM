import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import useAuth from "../hooks/useAuth"
import { register } from '../api/api'
import { saveAuthToStorage } from '../utils/authStorage'
import toast from "react-hot-toast";

const Signup = () => {
  const navigate = useNavigate()
  const {setAuth} = useAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setBusy(true);
  setMessage("");
  setErrorMsg("");

  const toastId = toast.loading("Creating your account...");

  try {
    const data = await register({
      email,
      password,
      first_name: "jhon",
      last_name: "Doe",
    });

    if (!data) {
      toast.error("Account creation failed. Please try again.", {
        id: toastId,
      });
      return;
    }

    saveAuthToStorage(data.access_token, data.user);

    setAuth({
      user: data.user,
      access_token: data.access_token,
      loading: false,
    });

    toast.success("Account created successfully. Welcome to AgroAI!", {
      id: toastId,
    });

    navigate("/");
  } catch (error) {
    toast.error("Unable to create your account. Please try again.", {
      id: toastId,
    });
  } finally {
    setBusy(false);
  }
};

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showAuthButtons={false} showLogout={false} />

      <main className="auth-layout animate-slide-up" style={{ position: 'relative', zIndex: 10 }}>
        {/* HERO LEFT COLUMN */}
        <section className="auth-hero">
          <div className="glass-card hero-card">
            <p className="eyebrow">Sustainable Yield Systems</p>
            <h1 style={{ fontSize: '42px', lineHeight: '1.2' }}>
              Build a Disease-Free Season with <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI Support</span>.
            </h1>
            <p style={{ fontSize: '15px' }}>
              Create your AgroAI Detect account to instantly unlock high-precision plant leaf analysis, historic trend logging, and automated regional alerts.
            </p>
            
            <div className="stat-grid">
              <div>
                <span className="stat">38+</span>
                <span className="label">Pathogen Classes</span>
              </div>
              <div>
                <span className="stat">24/7</span>
                <span className="label">Live Scanning</span>
              </div>
              <div>
                <span className="stat">5k+</span>
                <span className="label">Active Growers</span>
              </div>
            </div>
          </div>

          <div className="glass-card insight-card">
            <p className="insight-title">🌱 Membership Privileges</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Uncapped high-resolution ResNet leaf scans.</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Historical dashboard mapping crop health progress.</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Automated soil, ventilation, and spray recipe logs.</li>
            </ul>
          </div>
        </section>

        {/* AUTH RIGHT PANEL */}
        <section className="auth-panel glass-card" style={{ height: 'fit-content' }}>
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Join our scientific grower community today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              Email Address
              <input
                type="email"
                placeholder="researcher@agro.ai"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Secret Password
              <input
                type="password"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
                required
              />
            </label>

            <div className="form-row">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                />
                Automatically keep me signed in
              </label>
            </div>

            {message && <div className="toast success">{message}</div>}
            {errorMsg && <div className="toast error">{errorMsg}</div>}

            <button className="primary" type="submit" disabled={busy}>
              {busy ? (
                <>
                  <span className="scanning-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  Provisioning secure keys...
                </>
              ) : (
                'Create Account'
              )}
            </button>
            
            <p className="form-hint" style={{ color: 'var(--text-secondary)' }}>
              Already registered in our database? 
              <button className="link" style={{ marginLeft: '6px' }} onClick={() => navigate('/login')} type="button">
                Sign In Instead
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Signup
