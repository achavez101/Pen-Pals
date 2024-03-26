import React from 'react'
import logo from "../assets/pen.png"
import couch from "../assets/couch.png"
import { Link } from 'react-router-dom'

function Errorpage() {
  return (
    <div className="error-container">
        <div className="error-wrapper">
            <img src={couch} alt="" />
            <h1>404</h1>
            <h3>Page Not Found</h3>
            <span>The page you are looking for does not exist, please go back home.</span>
            <Link className="error-link" to="/">Home</Link>
        </div>
    </div>
  )
}

export default Errorpage