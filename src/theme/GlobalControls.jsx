import { useTheme } from '../theme/ThemeContext'
import { useLanguage } from '../i18n/LanguageContext'

const LANGS = [
  { code: 'en',       label: 'EN' },
  { code: 'hi',       label: 'हि'  },
  { code: 'hinglish', label: 'HG' },
]

export default function GlobalControls() {
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="global-controls">
      <div className="gc-pill">
        <button
          className={`gc-btn ${!isDark ? 'active' : ''}`}
          onClick={() => !isDark ? null : toggleTheme()}
          title={t('lightMode')}
        >
          {t('lightMode')}
        </button>
        <div className="gc-divider" />
        <button
          className={`gc-btn ${isDark ? 'active' : ''}`}
          onClick={() => isDark ? null : toggleTheme()}
          title={t('darkMode')}
        >
          {t('darkMode')}
        </button>
      </div>

      <div className="gc-pill">
        {LANGS.map((l, i) => (
          <span key={l.code} style={{ display: 'flex', alignItems: 'center' }}>
            {i > 0 && <div className="gc-divider" />}
            <button
              className={`gc-btn ${language === l.code ? 'active' : ''}`}
              onClick={() => setLanguage(l.code)}
              title={l.code === 'hinglish' ? 'Hinglish' : l.code === 'hi' ? 'Hindi' : 'English'}
            >
              {l.label}
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}
