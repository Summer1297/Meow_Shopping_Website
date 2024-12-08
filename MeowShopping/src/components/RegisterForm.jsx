import { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ onRegister, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!username.trim()) {
      setError('Username is required');
      return;
    }
    onRegister(username.trim());
  }

  return (
    <div className="register">
      <form className="register__form" onSubmit={handleSubmit}>
        <h1>Register</h1>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError('');
            }}
            placeholder="Enter username"
          />
        </label>
        {error && <div className="register__error">{error}</div>}
        <button type="submit">Register</button>
        <button 
          type="button" 
          className="register__switch-btn"
          onClick={onSwitchToLogin}
        >
          Already have an account? Login
        </button>
      </form>
    </div>
  );
}

export default RegisterForm; 