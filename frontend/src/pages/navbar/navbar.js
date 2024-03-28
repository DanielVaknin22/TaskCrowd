import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { NavbarContainer, NavbarLinkExtended, NavbarLink, 
  SubmitBtn, NavbarLinkContainer } from './navbar.style';

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(null);
  const history = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(null);
    history('/user/login');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('user');
      if (authData) {
        setIsAuth(authData);
      } else {
        setIsAuth(null);
      }
    }
  }, [history]);

  return (
    <NavbarContainer>
      <NavbarLinkContainer>
        {isAuth ? (
          <>
        <li><NavbarLink to="/home">Home</NavbarLink></li>
        <li><NavbarLink to="/user/profile">Profile</NavbarLink></li>
        <li><SubmitBtn onClick={handleLogout}>Logout</SubmitBtn></li>
        </>
        ) : (
          <>
          <li><NavbarLinkExtended to="/user/register">SignUp</NavbarLinkExtended></li>
        <li><NavbarLinkExtended to="/user/login">Login</NavbarLinkExtended></li>
          </>
        )}
      </NavbarLinkContainer>
    </NavbarContainer>
  );
};

export default Navbar;