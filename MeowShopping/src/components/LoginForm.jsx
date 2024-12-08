import { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleChange(e) {
    setUsername(e.target.value);
    setError(''); 
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    
    onLogin(username.trim())
      .catch(err => {
        switch(err.error) {
          case 'auth-insufficient':
            setError('This user is banned from the system');
            break;
          case 'user-not-found':
            setError('User not found. Please register first.');
            break;
          case 'invalid-username':
            setError('Invalid username format');
            break;
          default:
            setError('Login failed. Please try again.');
        }
      });
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        <label htmlFor="login-username">
          <span>Username:</span>
          <input
            id="login-username"
            name="username"
            className="login__username"
            value={username}
            onChange={handleChange}
            placeholder="Enter username"
            
          />
        </label>
        {error && <div className="login__error">{error}</div>}
        <button className="login__button" type="submit">
          Login
        </button>
        <button 
          type="button" 
          className="login__switch-btn"
          onClick={onSwitchToRegister}
        >
          Need an account? Register
        </button>
      </form>
    </div>
  );
}

export default LoginForm;