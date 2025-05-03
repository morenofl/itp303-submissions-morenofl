import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';
import { useContext } from 'react';
import { UserContext } from '../components/UserContext';


export default function Login() {
  const { isLoggedIn, setIsLoggedIn, setEmail: setUserEmail, setUserId } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // 👈 new

  const handleLogin = (e) => {
    e.preventDefault();
  
    
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId("user-123"); 
  
    navigate('/');
  };
  
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setErrorMessage('');
  
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
  
   
    setIsLoggedIn(true);
    setUserEmail(email);
    setUserId("user-456"); 
  
    navigate('/');
  };
  return (
    <>
      <div className="login-page">
        <div className="login-card">
          <h2 className="login-title">{isLogin ? "Login" : "Create Account"}</h2>

          <form className="login-form" onSubmit={isLogin ? handleLogin : handleCreateAccount} method="POST">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {/* 👇 Show error message if exists */}
          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
            <button type="submit" className="btn login-button">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          

          <button
            className="login-button btn create-account-button"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMessage(''); // reset errors when switching forms
            }}
          >
            {isLogin ? "Create New Account" : "Already Have an Account? Login"}
          </button>
        </div>
      </div>
    </>
  );
}
