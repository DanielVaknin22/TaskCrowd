import React, { useState } from 'react';
import { Title, VerticalContainer, LoginContainer,
  InputLbl, TextInput, SubmitBtn
} from './register.style';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user/register', {
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
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to register user');
    }
  };

  return (
    <VerticalContainer>
      <Title>User Registration</Title>
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
