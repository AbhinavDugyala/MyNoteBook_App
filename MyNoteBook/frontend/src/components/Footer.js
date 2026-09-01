import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertContext } from '../context/AlertContext'

function Footer() {
    const { showAlert } = useContext(AlertContext)
    const [email, setEmail] = useState('')

    const handleSubscribe = (event) => {
        event.preventDefault()
        const value = email.trim()
        if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            showAlert('Enter a valid email to subscribe', 'error')
            return
        }
        setEmail('')
        showAlert('Thanks — you are on the updates list.', 'success')
    }

    return (
        <footer className="site-footer">
            <div className="content">
                <div className="top">
                    <div className="logo-details">
                        <span className="logo_name"><span style={{ color: '#F7C948' }}>my</span>NoteBook</span>
                    </div>
                    <div className="media-icons">
                        <a href="https://www.instagram.com/abhinav.dugyala.5/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="https://github.com/AbhinavDugyala/MyNoteBook_App" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><i className="fab fa-github"></i></a>
                    </div>
                </div>
                <div className="link-boxes">
                    <ul className="box">
                        <li className="link_name">Company</li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About us</Link></li>
                        <li><Link to="/new">New note</Link></li>
                    </ul>
                    <ul className="box">
                        <li className="link_name">Workspace</li>
                        <li><Link to="/">Your notes</Link></li>
                        <li><Link to="/new">Create note</Link></li>
                        <li><Link to="/login">Sign in</Link></li>
                    </ul>
                    <ul className="box">
                        <li className="link_name">Account</li>
                        <li><Link to="/login">Sign in</Link></li>
                        <li><Link to="/register">Create account</Link></li>
                        <li><Link to="/forgot-password">Reset password</Link></li>
                    </ul>
                    <ul className="box input-box">
                        <li className="link_name">Stay in the loop</li>
                        <li className="footer-copy">Get a note when new features land. No spam.</li>
                        <li>
                            <form className="footer-form" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder="you@email.com"
                                    aria-label="Email address"
                                />
                                <button type="submit">Subscribe</button>
                            </form>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="bottom-details">
                <div className="bottom_text">
                    <span className="copyright_text">Copyright © {new Date().getFullYear()} <Link to="/">myNoteBook</Link>. All rights reserved.</span>
                    <span className="policy_terms">
                        <Link to="/about">Privacy</Link>
                        <Link to="/about">Terms</Link>
                    </span>
                </div>
            </div>
        </footer>
    )
}

export default Footer
