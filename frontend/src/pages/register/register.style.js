import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const InputLbl = styled.label`
  font-size: 16px;
  color:black;
  /* align-items: center; */
  /* display: block; */
  /* margin-bottom: 5px; */
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
    align-items: center;
    margin-bottom: 10px;
  }
`;

export const VerticalContainer = styled.div`
    /* background-repeat: no-repeat;
    background-repeat: no-repeat; */
    /* background-attachment: fixed; */
    /* background-size: cover; */
    text-align: center;
    margin-top: -100px;
    background-color: white;
    min-height: 100vh;
    /* flex-direction: column; */
    /* justify-content: center; */
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
    /* width: fit-content; */
    /* height: 40px; */
    padding: 10px;
    /* margin-bottom: 5px; */
    background-color: white;
    color: black;
    /* outline: none; */
    font-size: 15px;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

// export const TextInputContainer = styled.div`
//   position: relative;
//   width: 100%;
// `;

export const TextInput = styled.input`
  border: 1px solid black;
  width: 90%;
  height: 15px;
  border-radius: 5px;
  margin-bottom: 5px;
  /* background-color: rgba(1, 1, 1, 0.80); */
  color: black;
  padding: 5px 5px;
  font-size: 14px;
  line-height: 1.5;
  /* outline: none; */
  ::placeholder {
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }
  /* :-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px green inset;
    -webkit-text-fill-color: white;
  } */
`;

export const EyeLab = styled.span`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const EyeLab1 = styled.span`
  margin-left: 85%;
  display: block;
  cursor: pointer;
  margin-top: -45px ;
`;

export const TextMesasge = styled.h3`
  font-size: 13px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  font-style: italic;
  color: rgb(200 , 0, 0);
  text-align: left;
`;

export const NavLink = styled(Link)`
    color: #238636;
    text-decoration: none;
    &:hover{
        cursor: pointer;
        color: #2da042;
    }
`;