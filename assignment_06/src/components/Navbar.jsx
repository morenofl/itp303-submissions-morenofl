import React from 'react'
import { NavLink } from 'react-router-dom';
import "./Navbar.css"

export default function Navbar() {
    return (
        <nav id="navbar" className="navbar navbar-expand">
            <div className="container">
                <a className="navbar-brand" href="#">TechShop</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/featured">Featured</NavLink>

                        </li>
                        <li>
                            <NavLink className="nav-link" to="/search">Search</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

