// statistics.style.js
import styled from 'styled-components';

export const UserListContainer = styled.div`
 background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: flex;
    /* height: 100%; */
    text-align: center;
    background-color: rgba(0, 0, 0 , .9);
    min-height: 90.5vh;
    flex-direction: column;
    justify-content: center;
    margin-top: -22.4px;
    color: white;
    width: 100%;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
`;

export const UserItem = styled.div`
    margin-right: 1100px;
    color: white;
    font-size: 16px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    height: 40px;
    width: 450px;
    &:hover{
        cursor: pointer;
        color:  rgba(255, 255, 255, 0.5);
    }
`;

export const Popup = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center; 
`;

export const PopupContent = styled.div`
    height: flex;
    width: 250px;
    background-color: #3A3B3C;
    padding: 20px;
    border-radius: 15px;
    position: relative;
    text-align: start;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
    /* margin-top: 900px; */
`;

export const Btn = styled.button`
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 15px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    width: 150px;
    height: 37px;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;
