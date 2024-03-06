import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './pages/register/registerForm';
import Navbar from './pages/navbar/navbar';
import LoginForm from './pages/Login/login';
import Home from './pages/home/home';
import CreateTaskPage from './pages/createTask';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, []);

  const handleLogin = () => {
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuth(false);
  };

  return (
    <Router>
      <div>
        <Navbar isAuth={isAuth} onLogout={handleLogout} />
        <Routes>
          <Route path="/user/register" element={<RegistrationForm />} />
          <Route path="/user/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/give-tasks" element={ <CreateTaskPage /> } />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
