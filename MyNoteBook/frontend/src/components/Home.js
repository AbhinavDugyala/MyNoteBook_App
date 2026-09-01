import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import noteImg from '../images/myNoteBoook.png'
import Notes from './Notes'
import Layout from './Layout'
import { useAuth } from '../context/AuthContext'
import '../styles/home.css'

function Home() {
    const { isAuthenticated, user, bootstrapped, offline } = useAuth()

    if (!bootstrapped) {
        return (
            <Layout hideFooter>
                <div className="page-loading">Loading your notebook…</div>
            </Layout>
        )
    }

    if (isAuthenticated) {
        return (
            <Layout>
                <div className="container dashboard">
                    <div className="dashboard-hero">
                        <div>
                            <p className="eyebrow">{offline ? 'Saved on this device' : 'Cloud notebook'}</p>
                            <h1>Welcome back, {user?.username || 'friend'}</h1>
                            <p className="dashboard-lead">Create, search, and tidy your notes in one private workspace.</p>
                        </div>
                        <Button
                            component={Link}
                            to="/new"
                            variant="contained"
                            color="secondary"
                            className="dashboard-cta"
                            style={{ color: 'white', textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                        >
                            Create new note
                        </Button>
                    </div>
                    <Notes />
                </div>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="container-fluid landing">
                <div className="row align-items-center landing-hero">
                    <div className="col-lg-5 landing-copy">
                        <p className="eyebrow">Private notes, anywhere</p>
                        <h1 className="display-4"><span className="brand-mark">my</span>NoteBook</h1>
                        <p className="lead-text">Your notebook on the cloud — safe, searchable, and ready on every device.</p>
                        <p className="body-text">
                            Capture ideas, class notes, and checklists in one place. Edit them later, tag them so they stay findable, and keep them private to your account.
                        </p>
                        <div className="landing-actions">
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                color="secondary"
                                style={{ color: 'white', textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                            >
                                Get started free
                            </Button>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                color="secondary"
                                style={{ textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                            >
                                Sign in
                            </Button>
                        </div>
                    </div>
                    <div className="col-lg-7 d-flex justify-content-center">
                        <img className="img-fluid landing-art" src={noteImg} alt="Person organizing notes in myNoteBook" />
                    </div>
                </div>

                <div className="feature-grid">
                    <article className="feature-card">
                        <h3>Write without friction</h3>
                        <p>A title, a body, and a tag. That is all it takes to store a thought you can find again.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Yours alone</h3>
                        <p>Notes stay tied to your account. Nobody else can open, edit, or delete them.</p>
                    </article>
                    <article className="feature-card">
                        <h3>Works on your phone</h3>
                        <p>The same workspace on a laptop, tablet, or phone — no cramped forms or clipped buttons.</p>
                    </article>
                </div>
            </div>
        </Layout>
    )
}

export default Home
