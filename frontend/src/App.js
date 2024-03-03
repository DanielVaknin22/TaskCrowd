import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './pages/register/registerForm';
import Navbar from './pages/navbar';
import LoginForm from './pages/login';
import Home from './pages/home';
import CreateTaskPage from './pages/createTask';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/user/register" element={<RegistrationForm />} />
          <Route path="/user/login" element={<LoginForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/give-tasks" element={<CreateTaskPage />} />


        </Routes>
      </div>
    </Router>
  );
};

export default App;
