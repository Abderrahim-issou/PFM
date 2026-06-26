import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

type TopBarProps = {
  showAuthButtons?: boolean
  showLogout?: boolean
}

const TopBar = ({ showAuthButtons = true, showLogout = true }: TopBarProps) => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [menuOpen, setMenuOpen] = useState(false)

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

  const closeMenu = () => {
    setMenuOpen(false)
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

      <div className={`nav-links ${menuOpen ? 'mobile-open' : ''}`}>
        <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link-custom active' : 'nav-link-custom'}>
          Home
        </NavLink>

        <NavLink to="/about" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link-custom active' : 'nav-link-custom'}>
          About Project
        </NavLink>

        <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link-custom active' : 'nav-link-custom'}>
          Contact
        </NavLink>

        <NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link-custom active' : 'nav-link-custom'}>
          Dashboard
        </NavLink>
      </div>

      <div className="nav-actions">
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          type="button"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        <button
          className={`mobile-plant-menu ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          type="button"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? '🌿' : '♧'}
        </button>

        {user?.email ? (
          <>
            <button className="ghost desktop-only" onClick={() => navigate('/dashboard')} type="button">
              Dashboard
            </button>

            {showLogout && (
              <button
                className="secondary desktop-only"
                onClick={() => navigate('/')}
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
              <NavLink to="/login" className="nav-link-custom desktop-only">
                Login
              </NavLink>

              <NavLink
                to="/signup"
                className="primary desktop-only"
                style={{ padding: '8px 16px', borderRadius: '12px', fontSize: '13px' }}
              >
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