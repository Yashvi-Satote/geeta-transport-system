import { createContext, useState, useContext, useEffect } from 'react'
import { dummyUsers } from './authData'

export const AuthContext = createContext()

const STORAGE_KEY = 'geetaTransport_currentUser'
const USERS_KEY   = 'geetaTransport_users'
const LANG_KEY    = 'geetaTransport_language'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [users, setUsers] = useState(() => {
    // Merge dummy users with any users registered via signup
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) {
      try {
        const parsedStored = JSON.parse(stored)
        // Merge: dummy users base + any extra stored users not already in dummy list
        const mergedEmails = new Set(dummyUsers.map(u => u.email))
        const extraUsers = parsedStored.filter(u => !mergedEmails.has(u.email))
        return [...dummyUsers, ...extraUsers]
      } catch {
        return dummyUsers
      }
    }
    return dummyUsers
  })

  // Restore session on page reload
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setCurrentUser(JSON.parse(stored))
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  // Persist users list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  /**
   * login(email, password)
   * Returns { success, error, user }
   */
  const login = (email, password) => {
    const trimEmail = email.trim().toLowerCase()
    const user = users.find(
      u => u.email.toLowerCase() === trimEmail && u.password === password
    )
    if (!user) {
      return { success: false, error: 'Invalid email or password.' }
    }
    setCurrentUser(user)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    return { success: true, user }
  }

  /**
   * signup(userData)
   * Adds new user to the users list
   * Returns { success, error, user }
   */
  const signup = (userData) => {
    const trimEmail = userData.email.trim().toLowerCase()
    const exists = users.find(u => u.email.toLowerCase() === trimEmail)
    if (exists) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: trimEmail,
      password: userData.password,
      role: userData.role,
      busNumber: userData.busNumber || 'N/A',
      routeName: userData.routeName || 'N/A',
      busStop:   userData.busStop   || 'N/A',
      language: userData.language || localStorage.getItem(LANG_KEY) || 'en',
    }

    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  /**
   * logout()
   */
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const isLoggedIn = !!currentUser

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook
export function useAuth() {
  return useContext(AuthContext)
}
