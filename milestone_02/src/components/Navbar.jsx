import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import "./Navbar.css";
import Confirm from './Confirm';

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false); // 👈 new
  const navigate = useNavigate();

  function handleLogin() {
    if (isLoggedIn) {
      setShowConfirmLogout(true); // 👈 open popup instead of instantly logging out
    } else {
      navigate('/login');
    }
  }

  function confirmLogout() {
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
        <a className="navbar-brand" href="/#">StudyMatch</a>

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
