import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import './auth.css'

export default function Login({ onNavigateSignup }) {
  const { login } = useAuth()
  const { t, setLanguage } = useLanguage()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError(t('pleaseEnterEmailPassword') || 'Please enter email and password.')
      return
    }
    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))
    const result = login(email, password)
    if (!result.success) {
      setError(result.error)
    } else if (result.user?.language) {
      setLanguage(result.user.language)
    }
    setLoading(false)
  }

  const demos = [
    { label: 'Student',   email: 'student@gmail.com'  },
    { label: 'Driver',    email: 'driver@gmail.com'   },
    { label: 'Incharge',  email: 'incharge@gmail.com' },
    { label: 'Manager',   email: 'manager@gmail.com'  },
  ]

  const handleDemoLogin = async (role) => {
    const demoUsers = {
      student: { email: 'student@gmail.com', password: '1234' },
      driver: { email: 'driver@gmail.com', password: '1234' },
      incharge: { email: 'incharge@gmail.com', password: '1234' },
      manager: { email: 'manager@gmail.com', password: '1234' },
    }

    const user = demoUsers[role.toLowerCase()]
    if (!user) return

    setLoading(true)
    setError('')
    await new Promise(r => setTimeout(r, 500))
    const result = login(user.email, user.password)
    if (!result.success) {
      setError(result.error)
    } else if (result.user?.language) {
      setLanguage(result.user.language)
    }
    setLoading(false)
  }

  const fillDemo = (demoEmail) => {
    setEmail(demoEmail)
    setPassword('1234')
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">🚌</div>
          <h1 className="auth-app-name">Geeta Transport</h1>
          <p className="auth-tagline">Smart School Transport System</p>
        </div>

        <h2 className="auth-heading">{t('welcomeBack')}</h2>
        <p className="auth-sub">{t('signIn')}</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label">{t('email')}</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">✉️</span>
              <input
                className="auth-input"
                type="email"
                placeholder={t('emailPlaceholder') || 'you@example.com'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label">{t('password')}</label>
            <div className="auth-input-wrap">
              <span className="auth-input-icon">🔒</span>
              <input
                className="auth-input"
                type={showPass ? 'text' : 'password'}
                placeholder={t('passwordPlaceholder') || 'Enter password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPass(p => !p)}
                tabIndex={-1}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? <span className="auth-spinner" /> : t('signInBtn')}
          </button>
        </form>

        <div className="auth-divider"><span>{t('quickDemo') || 'Quick Demo Login'}</span></div>

        <div className="auth-demo-grid">
          {demos.map(d => (
            <button key={d.email} className="auth-demo-btn" onClick={() => handleDemoLogin(d.label)} disabled={loading}>
              {d.label}
            </button>
          ))}
        </div>

        <p className="auth-switch">
          {t('dontHaveAccount')} {' '}
          <button className="auth-link-btn" onClick={onNavigateSignup}>
            {t('signUp')}
          </button>
        </p>
      </div>
    </div>
  )
}
