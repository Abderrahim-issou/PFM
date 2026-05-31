import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import  useAuth  from '../hooks/useAuth'

type TopBarProps = {
  showAuthButtons?: boolean
  showLogout?: boolean
}

const TopBar = ({ showAuthButtons = true, showLogout = true }: TopBarProps) => {
  const { setAuth } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Alert: Grape Blight risk high',
      desc: 'Humidity levels are favorable for black rot in grape.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Scan complete',
      desc: 'Tomato crop analysis shows 97% confidence: Healthy.',
      time: '2h ago',
      unread: false,
    },
    {
      id: 3,
      title: 'Monthly report ready',
      desc: 'Download your May crop statistics report now.',
      time: '1d ago',
      unread: false,
    },
  ])

  useEffect(() => {
    const savedTheme = localStorage.getItem('agroai_theme') as 'dark' | 'light'
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem('agroai_theme', nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
  }

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <nav className="topbar">
      <div className="brand" onClick={() => navigate('/')}>
        <span className="brand__logo">🌱</span>
        <div>
          <p className="brand__title">AgroAI Detect</p>
          <p className="brand__tag">AI Crop intelligence</p>
        </div>
      </div>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'nav-link-custom active' : 'nav-link-custom'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          className={({ isActive }) =>
            isActive ? 'nav-link-custom active' : 'nav-link-custom'
          }
        >
          About Project
        </NavLink>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive ? 'nav-link-custom active' : 'nav-link-custom'
          }
        >
          Contact
        </NavLink>
        {true && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? 'nav-link-custom active' : 'nav-link-custom'
            }
          >
            Dashboard
          </NavLink>
        )}
      </div>

      <div className="nav-actions">
        {/* Theme Toggle Button */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          type="button"
        >
          {theme === 'dark' ? (
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg
              fill="none"
              height="18"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="18"
            >
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
            </svg>
          )}
        </button>

        {/* Notifications Button */}
        {true && (
          <div style={{ position: 'relative' }}>
            <button
              className="icon-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              title="Notifications"
              type="button"
            >
              <svg
                fill="none"
                height="18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unreadCount > 0 && <span className="badge-count">{unreadCount}</span>}
            </button>

            {showNotifications && (
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  width: '320px',
                  padding: '16px',
                  zIndex: 200,
                  boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--card-border)',
                    paddingBottom: '8px',
                  }}
                >
                  <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      className="link"
                      onClick={markAllAsRead}
                      style={{ fontSize: '11px' }}
                      type="button"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        background: n.unread ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                        border: '1px solid rgba(16, 185, 129, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: 700,
                            color: n.unread ? 'var(--primary)' : 'var(--text)',
                          }}
                        >
                          {n.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--muted)' }}>
                          {n.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', margin: 0, color: 'var(--text-secondary)' }}>
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Authenticated Actions */}
        {true ? (
          <>
            <button className="ghost" onClick={() => navigate('/dashboard')} type="button">
              <svg
                fill="none"
                height="14"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="14"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Dashboard
            </button>
            {showLogout && (
              <button
                className="secondary"
                onClick={() => {
                  // logout()
                  
                  navigate('/')
                }}
                style={{ padding: '8px 14px', borderRadius: '12px' }}
                type="button"
              >
                Logout
              </button>
            )}
          </>
        ) : (
          showAuthButtons && (
            <>
              <NavLink to="/login" className="nav-link-custom">
                Login
              </NavLink>
              <NavLink to="/signup" className="primary" style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '13px' }}>
                Join AgroAI
              </NavLink>
            </>
          )
        )}
      </div>
    </nav>
  )
}

export default TopBar
