import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import { login as login2 } from '../api/api'
import useAuth2 from '../hooks/useAuth'
import { saveAuthToStorage } from '../utils/authStorage'
import toast from "react-hot-toast";

const Login = () => {
  const { setAuth } = useAuth2()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(true)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault()
  //   setBusy(true)
  //   setMessage('')
  //   setErrorMsg('')

  //   window.setTimeout(() => {
  //     login(email, rememberMe)
  //     setBusy(false)
  //     setMessage('Successfully authenticated! Synchronizing secure workspace...')
  //     window.setTimeout(() => {
  //       navigate('/dashboard')
  //     }, 700)
  //   }, 1100)
  // }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  setBusy(true);
  setMessage("");
  setErrorMsg("");

  const toastId = toast.loading("Verifying your credentials...");

  try {
    const data = await login2({ email, password });

    if (!data) {
      toast.error("Login failed. Please check your email and password.", {
        id: toastId,
      });
      return;
    }
    console.log('the loged in data: ', data)
    saveAuthToStorage(data.access_token, data.user);
    setAuth({
      user: data.user,
      access_token: data.access_token,
      loading: false,
    });

    toast.success("Login successful. Welcome back!", {
      id: toastId,
    });

    navigate("/");
  } catch (error) {
    toast.error("Login failed. Please try again.", {
      id: toastId,
    });
  } finally {
    setBusy(false);
  }
};

  const handleForgotPassword = () => {
    if (!email) {
      setErrorMsg('Please input your email address first so we can transmit a recovery token.')
      return
    }
    setMessage(`Secure password recovery packet has been transmitted to ${email}.`)
  }

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showAuthButtons={false} showLogout={false} />

      <main className="auth-layout animate-slide-up" style={{ position: 'relative', zIndex: 10 }}>
        {/* HERO LEFT COLUMN */}
        <section className="auth-hero">
          <div className="glass-card hero-card">
            <p className="eyebrow">AgroAI Intelligent Core</p>
            <h1 style={{ fontSize: '42px', lineHeight: '1.2' }}>
              Detect Crop Diseases Faster with <span style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AgroAI</span>.
            </h1>
            <p style={{ fontSize: '15px' }}>
              Upload plant leaves, trigger our ResNet classifier model, and safeguard your agricultural yields with agronomist-validated treatments.
            </p>

            <div className="stat-grid">
              <div>
                <span className="stat">14+</span>
                <span className="label">Supported Strains</span>
              </div>
              <div>
                <span className="stat">98.7%</span>
                <span className="label">Avg. Accuracy</span>
              </div>
              <div>
                <span className="stat">2s</span>
                <span className="label">Scan Duration</span>
              </div>
            </div>
          </div>

          <div className="glass-card insight-card">
            <p className="insight-title">🌱 Smart Agronomist Directives</p>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Instant classification of early and late blight margins.</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Validation plans spanning organic cures and chemical isolations.</li>
              <li style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Regional micro-climate warnings synchronized to leaf humidity indicators.</li>
            </ul>
          </div>
        </section>

        {/* AUTH RIGHT PANEL */}
        <section className="auth-panel glass-card" style={{ height: 'fit-content' }}>
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Access your AgroAI crop intelligence console.</p>
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
                placeholder="Enter password (min. 6 characters)"
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
                Remember my terminal session
              </label>
              <button className="link" onClick={handleForgotPassword} type="button">
                Forgot password?
              </button>
            </div>

            {message && <div className="toast success">{message}</div>}
            {errorMsg && <div className="toast error">{errorMsg}</div>}

            <button className="primary" type="submit" disabled={busy}>
              {busy ? (
                <>
                  <span className="scanning-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  Verifying Security Cleared...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            <p className="form-hint" style={{ color: 'var(--text-secondary)' }}>
              New to AgroAI Detect?
              <button className="link" style={{ marginLeft: '6px' }} onClick={() => navigate('/signup')} type="button">
                Create Researcher Account
              </button>
            </p>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Login
