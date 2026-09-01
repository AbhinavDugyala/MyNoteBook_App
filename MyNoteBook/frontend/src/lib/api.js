import { API_HOST } from '../config'

export class ApiError extends Error {
    constructor(message, status = 500, payload = null) {
        super(message)
        this.status = status
        this.payload = payload
    }
}

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
        'Content-Type': 'application/json',
        ...(token && !token.startsWith('local.') ? { 'auth-token': token } : {}),
        ...options.headers,
    }

    const response = await fetch(`${API_HOST}${path}`, { ...options, headers })
    const json = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new ApiError(json.message || 'Request failed', response.status, json)
    }

    return json
}

export async function checkApiHealth() {
    try {
        const response = await fetch(`${API_HOST}/api/health`, { method: 'GET' })
        if (!response.ok) return false
        const json = await response.json().catch(() => ({}))
        return Boolean(json.success)
    } catch {
        return false
    }
}
