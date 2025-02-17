import React from 'react'
import "./Navbar.css"

export default function Navbar() {
    return (
        <nav id="navbar" className="navbar navbar-expand">
            <div className="container">
                <a className="navbar-brand" href="#">TechShop</a>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="#featuredProducts">Featured</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
}

