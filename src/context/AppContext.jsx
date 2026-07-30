import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getApplications, getOrders, getSettings, initializeStorage, saveSettings, seedSampleData } from '../services/storageService'

const AppContext = createContext(null)

function getInitialAuthState() {
  if (typeof window === 'undefined') {
    return { isAuthenticated: false, user: null }
  }

  const stored = window.localStorage.getItem('wegagen_auth')
  return stored ? JSON.parse(stored) : { isAuthenticated: false, user: null }
}

export function AppProvider({ children }) {
  const [applications, setApplications] = useState([])
  const [orders, setOrders] = useState([])
  const [settings, setSettings] = useState(getSettings())
  const [auth, setAuth] = useState(getInitialAuthState)

  const syncData = () => {
    initializeStorage()
    seedSampleData()
    setApplications(getApplications())
    setOrders(getOrders())
    setSettings(getSettings())
  }

  useEffect(() => {
    syncData()

    if (typeof window !== 'undefined') {
      window.addEventListener('wegagen:data-updated', syncData)
      return () => window.removeEventListener('wegagen:data-updated', syncData)
    }
  }, [])

  const refreshData = () => {
    syncData()
  }

  const updateSettings = (nextSettings) => {
    const saved = saveSettings(nextSettings)
    setSettings(saved)
  }

  const login = (user) => {
    const nextAuth = { isAuthenticated: true, user }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wegagen_auth', JSON.stringify(nextAuth))
    }
    setAuth(nextAuth)
  }

  const logout = () => {
    const nextAuth = { isAuthenticated: false, user: null }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('wegagen_auth', JSON.stringify(nextAuth))
    }
    setAuth(nextAuth)
  }

  const value = useMemo(() => ({
    applications,
    orders,
    settings,
    auth,
    refreshData,
    updateSettings,
    login,
    logout,
    setApplications,
    setOrders,
  }), [applications, orders, settings, auth])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
