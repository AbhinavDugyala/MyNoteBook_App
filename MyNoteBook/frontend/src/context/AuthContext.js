import { createContext, useContext, useEffect, useState } from 'react'
import { apiFetch, ApiError, checkApiHealth } from '../lib/api'
import {
    clearLocalSession,
    getLocalUser,
    localForgotPassword,
    localLogin,
    localRegister,
    localResetPassword,
    saveLocalUser,
} from '../lib/localStore'
import { isLocalToken } from '../config'

export const AuthContext = createContext()

export function AuthProvider(props) {
    const [token, setToken] = useState(() => localStorage.getItem('token'))
    const [user, setUser] = useState(() => getLocalUser())
    const [bootstrapped, setBootstrapped] = useState(false)
    const [offline, setOffline] = useState(false)

    const applySession = (authToken, nextUser) => {
        localStorage.setItem('token', authToken)
        if (nextUser) saveLocalUser(nextUser)
        setToken(authToken)
        setUser(nextUser || null)
    }

    const logout = () => {
        clearLocalSession()
        setToken(null)
        setUser(null)
    }

    useEffect(() => {
        let cancelled = false

        const bootstrap = async () => {
            const storedToken = localStorage.getItem('token')
            const apiUp = await checkApiHealth()
            if (!cancelled) setOffline(!apiUp)

            if (storedToken && !isLocalToken(storedToken) && apiUp) {
                try {
                    const json = await apiFetch('/api/auth/getuser', { method: 'POST' })
                    const nextUser = json.user || json
                    if (!cancelled) {
                        saveLocalUser(nextUser)
                        setUser(nextUser)
                        setToken(storedToken)
                    }
                } catch (err) {
                    if (err instanceof ApiError && err.status === 401) {
                        clearLocalSession()
                        if (!cancelled) {
                            setToken(null)
                            setUser(null)
                        }
                    }
                }
            }

            if (!cancelled) setBootstrapped(true)
        }

        bootstrap()
        return () => { cancelled = true }
    }, [])

    const shouldUseLocal = (err) => !(err instanceof ApiError) || err.status >= 500

    const register = async (values) => {
        try {
            const json = await apiFetch('/api/auth/createuser', {
                method: 'POST',
                body: JSON.stringify(values),
            })
            applySession(json.authToken, json.user)
            setOffline(false)
            return { ok: true }
        } catch (err) {
            if (!shouldUseLocal(err)) {
                return { ok: false, message: err.message }
            }
            const local = localRegister(values)
            if (local.ok) {
                applySession(local.authToken, local.user)
                setOffline(true)
                return { ok: true, offline: true }
            }
            return local
        }
    }

    const login = async (values) => {
        try {
            const json = await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify(values),
            })
            applySession(json.authToken, json.user)
            setOffline(false)
            return { ok: true }
        } catch (err) {
            if (!shouldUseLocal(err)) {
                return { ok: false, message: err.message }
            }
            const local = localLogin(values)
            if (local.ok) {
                applySession(local.authToken, local.user)
                setOffline(true)
                return { ok: true, offline: true }
            }
            return local
        }
    }

    const forgotPassword = async (email) => {
        try {
            const json = await apiFetch('/api/auth/forgotpassword', {
                method: 'POST',
                body: JSON.stringify({ email }),
            })
            return { ok: true, message: json.message, resetUrl: json.resetUrl }
        } catch (err) {
            if (err instanceof ApiError && err.status === 404) {
                const local = localForgotPassword(email)
                if (local.ok) return local
            }
            if (!shouldUseLocal(err) && err instanceof ApiError) {
                return { ok: false, message: err.message }
            }
            return localForgotPassword(email)
        }
    }

    const resetPassword = async (resetToken, password) => {
        try {
            const json = await apiFetch(`/api/auth/resetpassword/${resetToken}`, {
                method: 'PUT',
                body: JSON.stringify({ password }),
            })
            return { ok: true, message: json.message }
        } catch (err) {
            if (!shouldUseLocal(err)) {
                const local = localResetPassword(resetToken, password)
                if (local.ok) return local
                return { ok: false, message: err.message }
            }
            return localResetPassword(resetToken, password)
        }
    }

    return (
        <AuthContext.Provider value={{
            token,
            user,
            bootstrapped,
            offline,
            isAuthenticated: Boolean(token),
            login,
            register,
            logout,
            forgotPassword,
            resetPassword,
        }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
