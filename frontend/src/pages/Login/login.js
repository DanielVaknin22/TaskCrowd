// src/pages/Login/login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { VerticalContainer, Title, InputLbl, LoginContainer, 
  SubmitBtn, TextInput, NavLink } from './login.style';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const responseData = await response.json();
        if (response.status === 401) {
          alert(responseData.message);
        } else {
          alert('Failed to login');
        }
      } else {
        const responseData = await response.json();
        alert(responseData.message);
        const { userID, role } = responseData;
        if (userID !== undefined) {
          localStorage.setItem('userID', userID);
        }
        localStorage.setItem('user', JSON.stringify(responseData));
        localStorage.setItem('role', role);
        console.log('Login successful');
        onLogin(role);
        navigate(role === 'admin' ? '/admin' : '/home');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to login');
    }
  };

  return (
    <VerticalContainer>
      <h2 style={{marginTop: '60px', fontSize: '50px', fontFamily: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif` }}>TaskCrowd</h2>
      <Title>Login </Title>
      <form onSubmit={handleSubmit}>
        <LoginContainer>
          <InputLbl htmlFor="email">Email:</InputLbl>
          <TextInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <InputLbl htmlFor="password">Password:</InputLbl>
          <TextInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <SubmitBtn type="submit">Login</SubmitBtn>
        </LoginContainer>

        <InputLbl>&emsp;&emsp;Don't have an account?&nbsp;&nbsp;<NavLink to="/user/register">Sign up</NavLink> </InputLbl>
      </form>
    </VerticalContainer>
  );
};

export default LoginForm;
