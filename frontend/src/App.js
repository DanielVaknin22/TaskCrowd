import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './pages/register/registerForm';
import Navbar from './pages/navbar/navbar';
import LoginForm from './pages/Login/login';
import Home from './pages/home/home';
import CreateTaskPage from './pages/createTask/createTask';
import SolveTasksPage from './pages/solveTask/solveTasks';
import ProfilePage from './pages/profile';
import AdminPage from './pages/admin/admin';
import UserProfile from './pages/admin/userProfile';

const App = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      setIsAuth(true);
      setUserRole(role);
    } else {
      setIsAuth(false);
      setUserRole('');
    }
  }, []);

  const handleLogin = (role) => {
    setIsAuth(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuth(false);
    setUserRole('');
  };

  return (
    <Router>
      <div>
        <Navbar isAuth={isAuth} userRole={userRole} onLogout={handleLogout} />
        <Routes>
          <Route path="/user/register" element={<RegistrationForm />} />
          <Route path="/user/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/home" element={<Home />} />
          <Route path="/give-tasks" element={ <CreateTaskPage /> } />
          <Route path="/solve-tasks" element={<SolveTasksPage />} />
          <Route path="/user/profile" element={<ProfilePage />} />
          <Route path="/admin" element={isAuth && userRole === 'admin' ? <AdminPage /> : <Navigate to="/user/login" />} />
          <Route path="/admin/user/:id" element={isAuth && userRole === 'admin' ? <UserProfile /> : <Navigate to="/user/login" />} />
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
