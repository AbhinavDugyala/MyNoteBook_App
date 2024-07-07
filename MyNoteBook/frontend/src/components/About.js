import React from 'react'
import Navbar from "./Navbar";
import '../styles/about.css';
import awesome from '../images/about - awesome.jpeg'
import login from '../images/about-login.png'
import { Link } from "react-router-dom";
import { Button } from '@mui/material';
import Alertss from "./Alertss";

function About() {
    return (
        <div>
            <Navbar />
            <Alertss />
            <div className="text-white aboutImg text-center">
                <div className="note-img">
                    <h1 className="display-4">Enabling <span style={{ color: "orange" }}>Student Success</span></h1>
                    <p style={{color:"yellow"}}>A secure, private online platform for creating, editing, uploading, and deleting your notes effortlessly, with no interruptions, and easy access anytime, anywhere from across the World.</p>
                </div>
            </div>

            <div className="container mt-5 ">
                <div className="row">
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h2 className="mb-3" style={{ fontWeight: "Bold" }}>Create Something <span style={{ color: "red" }}>Extraordinary</span> </h2>
                        <p>myNotebook was born from the hassle of manually writing notes, which can be exhausting. We've developed an online web platform where you can create, edit, upload, and delete your notes securely and privately without interruptions. Enjoy access to your notes anytime, anywhere. Plus, our platform offers collaborative features so you can share and work on notes with others, ensuring you never miss a crucial detail. Don't forget to create notes because capturing your thoughts and ideas is always important!
                        </p>
                        <div className="d-flex justify-content-center mt-3">
                            <Button component={Link} to="/new" variant="contained" color="secondary" style={{ color: "White", textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.3rem" }}>Create New Note</Button>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <img className="img-fluid awesome" style={{width: "95%", marginTop: "15px", marginBottom: "5px"}} src={awesome} alt="about-awesome" />
                    </div>
                </div>

                <div className="row login mt-5 mb-5 p-5">
                    <div className="col-md-6">
                        <img className="img-fluid" src={login} alt="about-awesome" />
                    </div>
                    <div className="col-md-6 d-flex flex-column justify-content-center">
                        <h2 className="mb-3" style={{ fontWeight: "Bold" }}>Unleashing the Power of <span style={{ color: "red" }}>Visuals on the Internet</span> </h2>
                        <p>
                            How we started? Our journey began with a simple concept: myNoteBook emerged from the frustration of traditional note-taking methods. Now, enjoy our online platform where you can effortlessly create, edit, upload, and securely manage your notes without any interruptions.
                        </p>
                        <div className="d-flex justify-content-center mt-3">
                            <Button component={Link} to="/register" variant="contained" color="secondary" style={{ color: "White", textTransform: "none", fontFamily: "'Poppins', sans-serif", fontSize: "1.3rem" }}>Sign up now</Button>
                        </div>
                    </div>
                </div>
            </div>

            <footer>
                <div className="content">
                    <div className="top">
                        <div className="logo-details">
                            <span className="logo_name"><span style={{ color: "yellow" }}>my</span>Note<span style={{ color: "orange" }}>Book</span></span>
                        </div>
                        <div className="media-icons">
                            <Link to="/"><i className="fab fa-facebook-f"></i></Link>
                            <Link to="/"><i className="fab fa-twitter"></i></Link>
                            <a href="https://www.instagram.com/abhinav.dugyala.5/" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                            {/* <Link to="/https://www.instagram.com/abhinav.dugyala.5/"></i></Link> */}
                            <Link to="/"><i className="fab fa-linkedin-in"></i></Link>
                            <Link to="/"><i className="fab fa-youtube"></i></Link>
                        </div>
                    </div>
                    <div className="link-boxes">
                        <ul className="box">
                            <li className="link_name">Company</li>
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/new">New Notes</Link></li>
                            <li><Link to="/About">About us</Link></li>
                            <li><Link to="/">Get started</Link></li>
                            <li><Link to="/">Contact Us</Link></li>
                        </ul>
                        <ul className="box">
                            <li className="link_name">Services</li>
                            <li><Link to="/">Your Notes</Link></li>
                            <li><Link to="/new">New Note</Link></li>
                        </ul>
                        <ul className="box">
                            <li className="link_name">Account</li>
                            <li><Link to="/login">Sign-in</Link></li>
                            <li><Link to="/register">Sign Up for Free</Link></li>
                        </ul>
                        <ul className="box">
                            <li className="link_name">Top Categories</li>
                            <li><Link to="/c/61554bfe801949ad7b9be4ff">Tent Notes</Link></li>
                            <li><Link to="/c/61554c2753bcf306407cb1bd">RV and Van Notes</Link></li>
                            <li><Link to="/c/61554c43d2a6b15f764aff36">Canoe Notes</Link></li>
                            <li><Link to="c/61554c63dfd6a37d71449b5c">Survivalist Notes</Link></li>
                        </ul>
                        <ul className="box input-box">
                            <li className="link_name">About myNoteBook</li>
                            <li style={{color: "#F7FFFF"}}>
                            An online platform that lets you create, edit, upload, and delete your notes securely and privately, all without any interruptions.
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bottom-details">
                    <div className="bottom_text">
                        <span className="copyright_text">Copyright © 2024 <Link to="/">myNoteBook</Link>All rights reserved</span>
                        <span className="policy_terms">
                            <Link to="/">Privacy policy</Link>
                            <Link to="/">Terms & condition</Link>
                        </span>
                    </div>
                </div>
            </footer>

        </div>
    )
}

export default About
