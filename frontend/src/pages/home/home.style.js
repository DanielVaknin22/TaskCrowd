import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const HomeContainer = styled.div`
    text-align: center;
    margin-top: -100px;
    background-color: white;
    min-height: 100vh;
`;

export const Title = styled.h1`
    color: black;
    line-height: 7;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin-top: 100px;
`;

export const Btn = styled.button`
    border: 1px solid black;
    border-radius: 8px;
    padding: 10px;
    background-color: white;
    color: black;
    font-size: 15px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin: 1px;
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
  width: 190px;
  height: fit-content;
  border: 1px solid #21262d;
  border-radius: 10px;
  background-color: rgba(200, 200, 200, 0.2);
  margin: 0 auto;
  margin-top: -60px;
`;