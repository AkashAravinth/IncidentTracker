import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';

// BrowserRouter: A high-level component from React Router that wraps your entire app to enable client-side routing using the HTML5 History API. 
// It manages the URL history and ensures navigation happens without full page reloads, allowing a smooth single-page application (SPA) experience.

// Routes is a tag whihc will have a group of routes under it

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}></Route>
        <Route path="/home" element={<Home/>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
