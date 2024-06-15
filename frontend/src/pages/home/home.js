import React, { useState, useEffect } from 'react';
import { HomeContainer, Title, Btn, HomeLink, ChooseContainer, Stitle } from './home.style';

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <HomeContainer>
      {user && (
        <>
          {user.role === 'admin' ? (
            <>
              <Title>Hello {user.name}</Title>
              <HomeLink to="/admin">
                  <Btn>All Users</Btn>
                </HomeLink>
                <HomeLink to="/solve-tasks">
                  <Btn>All Tasks</Btn>
                </HomeLink>
                <HomeLink to="/give-tasks">
                  <Btn>Give Tasks</Btn>
                </HomeLink>
                <HomeLink to="/statistics">
                  <Btn>Statistics</Btn>
                </HomeLink>
            </>
          ) : (
            <>
              <Title>Hello {user.name}</Title>
              <Stitle>
                You can choose<br />
                would you want to upload a task?
                <br />Or would you want to solve a task?
              </Stitle>
              <ChooseContainer>
                <HomeLink to="/solve-tasks">
                  <Btn>Solve Tasks</Btn>
                </HomeLink>
                <HomeLink to="/give-tasks">
                  <Btn>Give Tasks</Btn>
                </HomeLink>
              </ChooseContainer>
            </>
          )}
        </>
      )}
    </HomeContainer>
  );
};

export default Home;
