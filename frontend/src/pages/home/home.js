import React, {useState, useEffect} from 'react';
// import { Link } from 'react-router-dom';
import { HomeContainer, Title, Btn, HomeLink, ChooseContainer, Stitle } from './home.style';

const Home = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
  
  return (
    <HomeContainer>
      <Title> Hello {user && user.name}</Title>
      <Stitle>
      You can choose<br/>
      would you want to upload a task?
      <br/>Or would you want to solve a task?</Stitle>
      <ChooseContainer>
        <HomeLink to="/solve-tasks">
          <Btn>Solve Tasks</Btn>
        </HomeLink>
        <HomeLink to="/give-tasks">
          <Btn>Give Tasks</Btn>
        </HomeLink>
      </ChooseContainer>
    </HomeContainer>
  );
};

export default Home;
