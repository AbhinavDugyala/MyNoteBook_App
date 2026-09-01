import React from 'react'
import PageNotFounds from '../images/404.png'
import { Button } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import Layout from './Layout'

function PageNotFound() {
    return (
        <Layout>
            <div className="container not-found">
                <h1>This page is not here</h1>
                <p>That address does not match a screen in myNoteBook. Head back home and continue from there.</p>
                <img className="img-fluid not-found-art" src={PageNotFounds} alt="404 illustration" />
                <Button variant="contained" color="secondary" startIcon={<ArrowBackIcon />} component={Link} to="/" style={{ textTransform: 'none', color: 'White' }}>
                    Go back home
                </Button>
            </div>
        </Layout>
    )
}

export default PageNotFound
