// api which is actually a axios is used for connecting with the backend server API routes.
// UseNavigate is for routing purpose in the frontEnd itself.

import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
    <div 
      className="relative flex min-h-screen w-full flex-col group/design-root font-display" 
    >
      <div className="flex flex-1 w-full min-h-screen">
        {/* Left Side: Image */}
        <div className="relative hidden flex-1 items-center justify-center lg:flex bg-slate-100">
            {/* Using a picsum placeholder that matches the office/abstract aesthetic as requested */}
            <img 
                className="absolute inset-0 h-full w-full object-cover" 
                alt="Abstract office background" 
                src="https://picsum.photos/seed/800/1200"
            />
          <div className="absolute inset-0 bg-blue-500/10"></div>
        </div>

        {/* Right Side: Form */}
        <div className="flex flex-1 flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-white">
          <div className="flex w-full max-w-md flex-col items-start gap-8">
            {/* Header / Logo */}
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-4xl text-primary">shield</span>
              <span className="text-2xl font-bold text-slate-800">IncidentTrack</span>
            </div>

            {/* Welcome Text */}
            <div className="flex w-full flex-col items-start gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome</h1>
              <p className="text-base font-normal text-slate-500">Log in to manage your incidents.</p>
            </div>

            {/* Login Form */}
            <form className="flex w-full flex-col items-stretch gap-4" onSubmit={handleSubmit}>
              
              {/* Username Input */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-slate-700">Username</p>
                <input 
                  className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-lg border border-slate-300 bg-white p-3 text-base font-normal leading-normal text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" 
                  placeholder="Enter your username" 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </label>

              {/* Password Input */}
              <label className="flex flex-col">
                <p className="pb-2 text-sm font-medium text-slate-700">Password</p>
                <div className="flex w-full flex-1 items-stretch rounded-lg">
                  <input 
                    className="form-input h-12 w-full flex-1 resize-none overflow-hidden rounded-l-lg border border-r-0 border-slate-300 bg-white p-3 pr-2 text-base font-normal leading-normal text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20" 
                    placeholder="Enter your password" 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    className="flex items-center justify-center rounded-r-lg border border-l-0 border-slate-300 bg-white px-4 text-slate-500 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" 
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </label>

              {/* Submit Button */}
              {error && <p style={{ color: 'red' }}>{error}</p>}
              <button className="flex h-12 w-full items-center justify-center rounded-lg bg-primary px-6 text-base font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all">
                Log In
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;