import React, { useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Button } from '@mui/material'
import { AlertContext } from '../context/AlertContext'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const navigate = useNavigate()
    const { showAlert } = useContext(AlertContext)
    const { isAuthenticated, user, logout, offline } = useAuth()

    const closeMenu = () => {
        const menu = document.getElementById('navbarNav')
        if (menu && menu.classList.contains('show')) {
            if (window.bootstrap?.Collapse) {
                const instance = window.bootstrap.Collapse.getInstance(menu) || new window.bootstrap.Collapse(menu)
                instance.hide()
            } else {
                menu.classList.remove('show')
            }
        }
    }

    const handleLogout = () => {
        logout()
        closeMenu()
        navigate('/login')
        showAlert('Signed out. See you soon.', 'success')
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light site-nav">
            <div className="container-fluid">
                <NavLink className="navbar-brand" to="/" onClick={closeMenu}>
                    <span className="brand-mark">my</span>NoteBook
                </NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto align-items-lg-center">
                        <li className="nav-item">
                            <Button className="nav-link" component={NavLink} to="/" onClick={closeMenu} variant="text" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                Home
                            </Button>
                        </li>
                        <li className="nav-item">
                            <Button className="nav-link" component={NavLink} to="/about" onClick={closeMenu} variant="text" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                About
                            </Button>
                        </li>
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Button className="nav-link" component={NavLink} to="/new" onClick={closeMenu} variant="text" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                    New note
                                </Button>
                            </li>
                        )}
                        {!isAuthenticated ? (
                            <div className="d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0 nav-auth">
                                <Button className="nav-link" component={NavLink} to="/login" onClick={closeMenu} variant="text" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                    Sign in
                                </Button>
                                <Button className="nav-cta" component={NavLink} to="/register" onClick={closeMenu} variant="outlined" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                    Create account
                                </Button>
                            </div>
                        ) : (
                            <li className="nav-session">
                                <span className="nav-user">{offline ? 'Offline' : 'Hi'}, {user?.username || 'there'}</span>
                                <Button onClick={handleLogout} variant="outlined" color="secondary" style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '0.95rem' }}>
                                    Sign out
                                </Button>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
