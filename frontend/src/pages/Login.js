// api which is actually a axios is used for connecting with the backend server API routes.
// UseNavigate is for routing purpose in the frontEnd itself.

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

// asyn is used, because, the code within the asyn function can be made as asynchronous, so the await is teh asynchrounous thing within.,
// so the await is used to pause the code within untill the "api" whihc is actually a promise is settled.
// So till then, the other things in the browser will be performed asynchronously.
  const handleSubmit = async (e) => {
    // e.preventDefault() prevents the default browser behavior of form submission, 
    // which would cause a page reload and send a POST request to the current URL
    e.preventDefault();
    try {
      const response = await api.get('/auth/login', {
        auth: {
          username,
          password,
        },
      });
      // Store credentials in localStorage

    //   Credentials like username and password, or more commonly authentication tokens, are stored in localStorage to persist the authentication state across browser sessions and page reloads. 
    //   This means that once a user logs in successfully, their credentials or token remain saved in the browser even if they refresh the page or close and reopen the browser, allowing the app to remember the logged-in user without requiring them to log in again.

    //   In your Login component, storing username and password in localStorage means the app can restore or reuse these values later to maintain the user's authenticated session or to reconfigure Axios default auth without asking for credentials again.
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);

      
      // Set default auth for api
      api.defaults.auth = {
        username,
        password,
      };

    // this is used to navigate to the main route in the client side.
      navigate('/home');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
