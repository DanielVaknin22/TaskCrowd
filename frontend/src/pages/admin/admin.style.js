import styled from 'styled-components';

export const HomeWrapper = styled.div`
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

export const UL = styled.ul`
    margin-right: 1100px;
    color: white;
    font-size: 16px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    height: 40px;
    &:hover{
        cursor: pointer;
        color:  rgba(255, 255, 255, 0.5);
    }
`;