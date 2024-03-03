import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    history('/user/login');
  };

  return (
    <nav>
      <ul>
        <li><Link to="/user/register">SignUp</Link></li>
        <li><Link to="/user/login">Login</Link></li>
        <li><button onClick={handleLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};

export default Navbar;
