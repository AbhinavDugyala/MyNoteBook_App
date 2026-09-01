import React from 'react'
import awesome from '../images/about - awesome.jpeg'
import login from '../images/about-login.png'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import Layout from './Layout'
import { useAuth } from '../context/AuthContext'
import '../styles/about.css'

function About() {
    const { isAuthenticated } = useAuth()

    return (
        <Layout>
            <div className="text-white aboutImg">
                <div className="note-img">
                    <h1 className="display-5">A quieter place for <span>your notes</span></h1>
                    <p>myNoteBook is a private notebook you can open from any device. Write something once, come back to it later, and keep it out of the way of everyone else.</p>
                </div>
            </div>

            <div className="container about-body">
                <div className="row align-items-center g-4">
                    <div className="col-lg-6">
                        <h2>Create something you can find again</h2>
                        <p>
                            The app started as a way to stop losing scraps of paper and half-finished docs. You get a title, a longer note, and a tag — enough structure to stay organized without turning writing into a project of its own.
                        </p>
                        <div className="about-actions">
                            <Button
                                component={Link}
                                to={isAuthenticated ? '/new' : '/register'}
                                variant="contained"
                                color="secondary"
                                style={{ color: 'White', textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                            >
                                {isAuthenticated ? 'Write a note' : 'Create a free account'}
                            </Button>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <img className="img-fluid about-photo" src={awesome} alt="Person writing notes at a desk" />
                    </div>
                </div>

                <div className="row login about-panel align-items-center g-4">
                    <div className="col-lg-6 order-lg-1 order-2">
                        <img className="img-fluid about-photo" src={login} alt="Signing in to myNoteBook" />
                    </div>
                    <div className="col-lg-6 order-lg-2 order-1">
                        <h2>Your notes stay with your account</h2>
                        <p>
                            Sign in once and your notes load from your account — or, if the server is offline, from this device. Edit them, search them, or delete them when they are no longer useful.
                        </p>
                        <div className="about-actions">
                            <Button
                                component={Link}
                                to={isAuthenticated ? '/' : '/login'}
                                variant="contained"
                                color="secondary"
                                style={{ color: 'White', textTransform: 'none', fontFamily: "'Poppins', sans-serif", fontSize: '1.05rem' }}
                            >
                                {isAuthenticated ? 'Open my notes' : 'Sign in'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default About
