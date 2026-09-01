import { createContext, useRef, useState } from 'react'

export const AlertContext = createContext()

export function AlertProvider(props) {
    const [alert, setAlert] = useState(null)
    const [open, setOpen] = useState(false)
    const timerRef = useRef(null)

    const removeAlert = () => {
        setOpen(false)
        setAlert(null)
        if (timerRef.current) {
            clearTimeout(timerRef.current)
            timerRef.current = null
        }
    }

    const showAlert = (message, type = 'info') => {
        setOpen(true)
        setAlert({ message, type })
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
            setOpen(false)
            setAlert(null)
        }, 4500)
    }

    return (
        <AlertContext.Provider value={{ showAlert, alert, open, removeAlert }}>
            {props.children}
        </AlertContext.Provider>
    )
}
