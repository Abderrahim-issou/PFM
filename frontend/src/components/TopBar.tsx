import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import  useAuth  from '../hooks/useAuth'

type TopBarProps = {
  showAuthButtons?: boolean
  showLogout?: boolean
}

const TopBar = ({ showAuthButtons = true, showLogout = true }: TopBarProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')


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

        {/* Authenticated Actions */}
        {user?.email ? (
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
