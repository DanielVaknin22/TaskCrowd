import styled from 'styled-components';

export const HomeWrapper = styled.div`
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: flex;
    height: 100%;
    text-align: center;
    background-color: rgba(0, 0, 0 , .9);
    min-height: 88.5vh;
    flex-direction: column;
    justify-content: center;
    margin-top: -20px;
    color: white;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

export const TaskType = styled.select`
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
  color: white;
  padding: 5px 5px;
  font-size: 14px;
  ::placeholder {
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }

`;

export const TextInput = styled.input`
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
  color: white;
  padding: 5px 5px;
  font-size: 14px;
  ::placeholder {
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }

`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: white;
`;

export const Fields = styled.div`
  background-color: rgba(200, 200, 200, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  width: 500px;
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
//   display: flex;
//   flex-direction: column;
  border: 1.2px solid rgba(255, 255, 255, 0.1);
`;

export const Btn = styled.button`
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 15px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    height: 40px;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

export const PlusImg = styled.image`
    font-size: 30px;
    margin-top: -19px;
    font-weight: bold;
    margin-left: -10px;
`;


export const TextArea = styled.textarea`
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  margin-bottom: 5px;
  color: white;
  padding: 5px 5px;
  font-size: 14px;
  height: 200px;
  width: 450px;
  ::placeholder {
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }

`;