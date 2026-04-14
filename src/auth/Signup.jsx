import { useState } from 'react'
import { useAuth } from './AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import './auth.css'

const ROLES = [
  { value: 'student',  label: '🎒 Student'      },
  { value: 'driver',   label: '🚗 Bus Driver'    },
  { value: 'incharge', label: '📋 Bus Incharge'  },
  { value: 'manager',  label: '🏢 Manager'       },
  { value: 'teacher',  label: '🏫 Teacher'       },
]

export default function Signup({ onNavigateLogin }) {
  const { signup } = useAuth()
  const { t, language: appLanguage, setLanguage } = useLanguage()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    busNumber: '', routeName: '', busStop: '',
    language: appLanguage || 'en',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleRoleSelect = (r) => { setRole(r); setStep(2) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password) {
      setError(t('fillAllFields') || 'Please fill in all required fields.')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch') || 'Passwords do not match.')
      return
    }
    if (formData.password.length < 4) {
      setError(t('passwordMinLength') || 'Password must be at least 4 characters.')
      return
    }

    setLoading(true)
    await new Promise(r => setTimeout(r, 500))

    const result = signup({ ...formData, role })
    if (!result.success) {
      setError(result.error)
    } else {
      setLanguage(result.user.language)
    }
    setLoading(false)
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">🚌</div>
          <h1 className="auth-app-name">Geeta Transport</h1>
          <p className="auth-tagline">Smart School Transport System</p>
        </div>

        {step === 1 ? (
          <>
            <h2 className="auth-heading">{t('createAccount')}</h2>
            <p className="auth-sub">{t('chooseRole')}</p>

            <div className="auth-role-grid">
              {ROLES.map(r => (
                <button
                  key={r.value}
                  className="auth-role-card"
                  onClick={() => handleRoleSelect(r.value)}
                >
                  <span style={{ fontSize: '1.6rem' }}>{r.label.split(' ')[0]}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>

            <p className="auth-switch">
              {t('alreadyHaveAccount')} {' '}
              <button className="auth-link-btn" onClick={onNavigateLogin}>{t('signIn')}</button>
            </p>
          </>
        ) : (
          <>
            <div className="auth-header-row">
              <button className="auth-back-btn" onClick={() => { setStep(1); setError('') }}>
                ← {t('back')}
              </button>
              <div>
                <h2 className="auth-heading" style={{ margin: 0 }}>
                  {ROLES.find(r => r.value === role)?.label} {t('signUp')}
                </h2>
              </div>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field">
                <label className="auth-label">{t('fullName')} *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input className="auth-input" type="text" name="name"
                    placeholder={t('fullNamePlaceholder') || 'Your full name'}
                    value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">{t('email')} *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉️</span>
                  <input className="auth-input" type="email" name="email"
                    placeholder={t('emailPlaceholder') || 'you@example.com'}
                    value={formData.email} onChange={handleChange} required />
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">{t('password')} *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className="auth-input" type={showPass ? 'text' : 'password'} name="password"
                    placeholder={t('passwordPlaceholder') || 'Min. 4 characters'}
                    value={formData.password} onChange={handleChange} required />
                  <button type="button" className="auth-eye-btn" onClick={() => setShowPass(p => !p)} tabIndex={-1}>
                    {showPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">{t('confirmPassword')} *</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input className="auth-input" type={showPass ? 'text' : 'password'} name="confirmPassword"
                    placeholder={t('confirmPasswordPlaceholder') || 'Re-enter password'}
                    value={formData.confirmPassword} onChange={handleChange} required />
                </div>
              </div>

              {(role === 'student' || role === 'driver' || role === 'incharge') && (
                <div className="auth-field">
                  <label className="auth-label">{t('busNumber')}</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🚌</span>
                    <input className="auth-input" type="text" name="busNumber"
                      placeholder={t('busNumberPlaceholder') || 'e.g. 101'}
                      value={formData.busNumber} onChange={handleChange} />
                  </div>
                </div>
              )}

              {role === 'student' && (
                <div className="auth-field">
                  <label className="auth-label">{t('busStop')}</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">📍</span>
                    <input className="auth-input" type="text" name="busStop"
                      placeholder={t('busStopPlaceholder') || 'e.g. Stop A'}
                      value={formData.busStop} onChange={handleChange} />
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-label">{t('language')}</label>
                <select
                  className="auth-input"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                >
                  <option value="en">{t('english')}</option>
                  <option value="hi">{t('hindi')}</option>
                  <option value="hinglish">{t('hinglish')}</option>
                </select>
              </div>

              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : t('createAccount')}
              </button>
            </form>

            <p className="auth-switch">
              {t('alreadyHaveAccount')} {' '}
              <button className="auth-link-btn" onClick={onNavigateLogin}>{t('signIn')}</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
