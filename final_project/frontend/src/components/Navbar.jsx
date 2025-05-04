import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import "./Navbar.css";
import Confirm from './Confirm';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); 
  const navigate = useNavigate();

  function handleLogin() {
    if (isLoggedIn) {
      setShowConfirmLogout(true); 
    } else {
      navigate('/login');
    }
  }

  async function confirmLogout() {
    try {
      await fetch('https://final-project-ro9j.onrender.com/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
      
    } catch (err) {
      console.error("Logout failed:", err);
    }
    
    setIsLoggedIn(false);
    setShowConfirmLogout(false);
    navigate('/');
  }

  function cancelLogout() {
    setShowConfirmLogout(false);
  }

  return (
    <nav id="navbar" className="navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand" to="/">StudyMatch</Link>

        <div className="d-flex gap-3">
          <Link to="/search" className="btn pinkButton">Search</Link>

          <Link to="/groups" className="btn pinkButton">Groups</Link>

          <button className="btn pinkButton" onClick={handleLogin}>
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      </div>


      {showConfirmLogout && (
        <Confirm
          message="Are you sure you want to log out?"
          confirmLabel="Yes, Logout"
          cancelLabel="Cancel"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </nav>
  );
}
