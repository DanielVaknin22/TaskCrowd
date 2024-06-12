import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HomeContainer = styled.div`
    text-align: center;
    margin-top: -100px;
    background-color: rgba(0, 0, 0 , .9);
    min-height: 88.5vh;
`;

export const Title = styled.h1`
    color: white;
    line-height: 3;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin-top: 100px;
`;

export const Stitle = styled.p`
    color: white;
    line-height: 1.5;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin-top: 40px;
    font-size: 25px;
`;

export const Btn = styled.button`
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 15px;
    margin: 10px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

export const HomeLink = styled(Link)`
    color: gray;
    text-decoration: none;
    &:hover{
        cursor: pointer;
        color: rgba(200, 200, 200, 01);
    }
`;

export const ChooseContainer = styled.div`
  display: flex;
  flex-direction: line;
  align-items: center;
  padding: 20px 50px;
  width: 230px;
  height: fit-content;
  border: 1.2px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  background-color: rgba(200, 200, 200, 0.05);
  margin: 0 auto;
  margin-top: -10px;
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);

`;