import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Title, VerticalContainer, LoginContainer,
  InputLbl, TextInput, SubmitBtn
} from './register.style';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    idNumber: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.error);
        return;
      }
      const data = await response.json();
      alert(data.message);
      setFormData({ name: '', email: '', password: '', idNumber: '' });
      navigate('/user/login');
    } catch (error) {
      console.error(error);
      alert('Failed to register user');
    }
  };

  return (
    <VerticalContainer>
      <h2 style={{marginTop: '60px', fontSize: '50px', fontFamily: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif` }}>TaskCrowd</h2>
      <Title>Registration</Title>
      <LoginContainer onSubmit={handleSubmit}>
        <div>
          <InputLbl htmlFor="name">Name:</InputLbl>
          <TextInput
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputLbl htmlFor="email">Email:</InputLbl>
          <TextInput
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputLbl htmlFor="idNumber">ID Number:</InputLbl>
          <TextInput
            type="text"
            id="idNumber"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <InputLbl htmlFor="password">Password:</InputLbl>
          <TextInput
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <SubmitBtn onClick={handleSubmit}>Sign up</SubmitBtn>

      </LoginContainer>
    </VerticalContainer>
  );
};

export default RegistrationForm;
