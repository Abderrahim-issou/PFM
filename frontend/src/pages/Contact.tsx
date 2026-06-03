import { useState } from 'react'
import type { FormEvent } from 'react'
import TopBar from '../components/TopBar'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [crop, setCrop] = useState('tomato')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess('')

    setTimeout(() => {
      setSending(false)
      setSuccess('Your request has been securely dispatched to our agronomy support team. We will reply within 4 hours!')
      setName('')
      setEmail('')
      setMessage('')
    }, 1200)
  }

  return (
    <div className="shell">
      <div className="cyber-grid"></div>
      <TopBar showAuthButtons showLogout={false} />

      <main className="text-page-layout animate-slide-up" style={{ position: 'relative', zIndex: 10 }}>
        {/* HEADER */}
        <section className="text-page-header">
          <span className="badge-futuristic">Global Support Channels</span>
          <h1>Contact Our Agronomists</h1>
          <p>
            Have technical questions about our computer vision models, need crop diagnostics assistance, or want to integrate our SaaS API? Drop us a note!
          </p>
        </section>

        {/* CONTENT LAYOUT */}
        <section className="contact-layout">
          {/* CONTACT FORM */}
          <div className="glass-card">
            <h3 style={{ marginBottom: '16px' }}>Send a Message</h3>
            <form onSubmit={handleSubmit} className="auth-form">
              <label>
                Your Name
                <input
                  type="text"
                  placeholder="Dr. Green Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>

              <label>
                Email Address
                <input
                  type="email"
                  placeholder="researcher@agro.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>

              <label>
                Primary Crop Interest
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    background: 'rgba(4, 9, 7, 0.4)',
                    color: '#fff',
                    fontSize: '15px',
                  }}
                >
                  <option value="tomato">Tomato Varieties</option>
                  <option value="potato">Potato Varieties</option>
                  <option value="grape">Grapes & Vineyards</option>
                  <option value="apple">Apples & Orchards</option>
                  <option value="other">Other Crop Species</option>
                </select>
              </label>

              <label>
                Message Details
                <textarea
                  rows={5}
                  placeholder="Describe your issue or custom enterprise inquiry..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    background: 'rgba(4, 9, 7, 0.4)',
                    color: '#fff',
                    fontSize: '15px',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  required
                ></textarea>
              </label>

              {success && <div className="toast success">{success}</div>}

              <button className="primary" type="submit" disabled={sending}>
                {sending ? 'Encrypting & dispatching...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* CONTACT INFO CARD */}
          <div className="contact-card-list">
            <div className="glass-card">
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>Research Headquarter</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                AgroAI Research Lab<br />
                Building D, Biotech Science Park<br />
                Route de Lausanne, Switzerland
              </p>
            </div>

            <div className="glass-card">
              <h4 style={{ color: 'var(--secondary)', marginBottom: '8px' }}>Direct Communication</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                Email: **support@agro.ai**<br />
                Lab Line: **+41 (21) 505-2026**
              </p>
              <span style={{ fontSize: '12px', color: 'var(--muted)' }}>
                Response time: 7 days a week, 24h a day for premium members.
              </span>
            </div>

            <div className="glass-card">
              <h4 style={{ color: 'var(--primary)', marginBottom: '8px' }}>API & Enterprise Integration</h4>
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                Looking to deploy AgroAI models directly inside your industrial greenhouses or custom agricultural robotics? Get in touch with our partnerships lead for dedicated SDK access keys.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Contact
