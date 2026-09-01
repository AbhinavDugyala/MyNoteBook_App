import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Home from './components/Home'
import About from './components/About'
import { NoteProvider } from './context/notes/NoteContext'
import { AlertProvider } from './context/AlertContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import AddNote from './components/AddNote'
import PageNotFound from './components/PageNotFound'
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'
import Login from './components/Login'
import Register from './components/Register'

function ProtectedRoute({ children }) {
    const { isAuthenticated, bootstrapped } = useAuth()
    if (!bootstrapped) return null
    if (!isAuthenticated) return <Navigate to="/login" replace />
    return children
}

function GuestRoute({ children }) {
    const { isAuthenticated, bootstrapped } = useAuth()
    if (!bootstrapped) return null
    if (isAuthenticated) return <Navigate to="/" replace />
    return children
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<ProtectedRoute><AddNote /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
            <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
            <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
            <Route path="/users/password/new" element={<Navigate to="/forgot-password" replace />} />
            <Route path="/reset-password/:resetToken" element={<GuestRoute><ResetPassword /></GuestRoute>} />
            <Route path="/users/password/edit/:resetToken" element={<ResetPasswordRedirect />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    )
}

function ResetPasswordRedirect() {
    const { resetToken } = useParams()
    return <Navigate to={`/reset-password/${resetToken}`} replace />
}

function App() {
    return (
        <AuthProvider>
            <AlertProvider>
                <NoteProvider>
                    <AppRoutes />
                </NoteProvider>
            </AlertProvider>
        </AuthProvider>
    )
}

export default App
