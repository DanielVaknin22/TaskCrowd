import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const InputLbl = styled.label`
  font-size: 16px;
  color:black;
  display: block;
`;

export const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 30px;
  width: 300px;
  height: fit-content;
  border: 1px solid #21262d;
  border-radius: 10px;
  background-color: rgba(200, 200, 200, 0.2);
  margin: 0 auto;
  margin-top: -60px;
  ${InputLbl} {
    display: flex;
    margin-bottom: 10px;
  }
`;

export const VerticalContainer = styled.div`
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

export const SubmitBtn = styled.button`
    border: 1px solid black;
    border-radius: 8px;
    padding: 10px;
    background-color: white;
    color: black;
    font-size: 15px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;

    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

export const TextInput = styled.input`
  border: 1px solid black;
  width: 90%;
  height: 15px;
  border-radius: 5px;
  margin-bottom: 5px;
  color: black;
  padding: 5px 5px;
  font-size: 14px;
  ::placeholder {
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }

`;

// export const EyeLab = styled.span`
//   position: absolute;
//   top: 50%;
//   right: 20px;
//   transform: translateY(-50%);
//   cursor: pointer;
// `;

// export const EyeLab1 = styled.span`
//   margin-left: 85%;
//   display: block;
//   cursor: pointer;
//   margin-top: -45px ;
// `;

export const NavLink = styled(Link)`
    color: gray;
    text-decoration: none;
    &:hover{
        cursor: pointer;
        color: rgba(200, 200, 200, 01);
    }
`;