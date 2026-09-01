export const API_HOST = process.env.REACT_APP_API_URL || ''

export const isLocalToken = (token = localStorage.getItem('token')) =>
    Boolean(token && String(token).startsWith('local.'))
