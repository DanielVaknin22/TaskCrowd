import React from 'react';
// import { Link } from 'react-router-dom';
import { HomeContainer, Title, Btn, HomeLink, ChooseContainer } from './home.style';

const Home = () => {
  return (
    <HomeContainer>
      <Title>Choose what do you want</Title>
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
