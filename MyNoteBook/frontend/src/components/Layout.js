import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import Alertss from './Alertss'

function Layout({ children, hideFooter = false }) {
    return (
        <div className="app-shell">
            <Navbar />
            <div className="app-alert">
                <Alertss />
            </div>
            <main className="app-main">{children}</main>
            {!hideFooter && <Footer />}
        </div>
    )
}

export default Layout
