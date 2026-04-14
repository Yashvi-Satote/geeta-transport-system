import { createContext, useState, useContext, useEffect } from 'react'
import { translations } from './translations'

const LanguageContext = createContext()
const LANG_KEY = 'geetaTransport_language'

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'en'
  })

  useEffect(() => {
    localStorage.setItem(LANG_KEY, language)
    document.documentElement.setAttribute('lang', language === 'hi' ? 'hi' : 'en')
  }, [language])

  // t('key') — returns the translated string for current language
  const t = (key) => {
    const dict = translations[language] || translations.en
    return dict[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
