import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './Login.css';
import { UserContext } from '../components/UserContext';

export default function Login() {
  const {
    isLoggedIn,
    setIsLoggedIn,
    email,
    setEmail,
    user_id,
    setUserId
  } = useContext(UserContext);

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [localEmail, setLocalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email: localEmail, password })
      });

      const data = await res.json();

      if (res.ok && data.message === 'Success') {
        setIsLoggedIn(true);
        setEmail(localEmail);
        
        setUserId(data.user_id || ''); // depends on your backend response
        navigate('/');
      } else {
        setErrorMessage(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          
        },
        credentials: 'include',
        body: JSON.stringify({ email: localEmail, password })
      });

      const data = await res.json();

      if (data.error) {
        setErrorMessage(data.error);
        return;
      }

      setIsLoggedIn(true);
      setEmail(localEmail);
      setUserId(data.user_id || '');
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      setErrorMessage('Something went wrong. Please try again.');
    }
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
                value={localEmail}
                onChange={(e) => setLocalEmail(e.target.value)}
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
              setErrorMessage('');
            }}
          >
            {isLogin ? "Create New Account" : "Already Have an Account? Login"}
          </button>
        </div>
      </div>
    </>
  );
}
