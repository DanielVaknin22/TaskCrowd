import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const NavbarContainer = styled.nav`
  width: 100%;
  height: 50px;
  background-color: rgba(0, 0, 0 , .85);
  flex-wrap: wrap;
  display: flex;
  border: 1.2px solid rgba(255, 255, 255, 0.1);
  // /* flex-direction: column; */
  // position: fixed;
  // /* top: 0; */
  // /* z-index: 999; */
  @media (min-width: 850px) {
    height: 50px;
  }
`;

export const NavbarLinkContainer = styled.div`
  display: flex;
`;

export const NavbarLinkExtended = styled(Link)`
  color: white;
  font-size: x-large;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-decoration: none;
  margin: 10px;
  &:hover{
        cursor: pointer;
        color: gray;
       
    }
`;
export const NavbarLink = styled(Link)`
  color: white;
  font-size: x-large;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  text-decoration: none;
  margin: 20px;
  &:hover{
        /* margin-top: 5px; */
        cursor: pointer;
        color: rgba(200, 200, 200, 0.8);
    }
  /* @media (max-width: 850px) {
    display: none;
  } */
`;

// export const Logo = styled.img`
//   margin: 10px;
//   max-width: 180px;
//   height: auto;
// `;

// export const OpenLinksButton = styled.button`
//   width: 70px;
//   height: 50px;
//   background: none;
//   border: none;
//   color: white;
//   font-size: 45px;
//   cursor: pointer;
//   @media (min-width: 850px) {
//     display: none;
//   }
// `;

export const NavbarExtendedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* width: 300px; */
  @media (min-width: 850px) {
    display: none;
  }
`;

export const SubmitBtn = styled.button`
  border: 1px solid gray;
  border-radius: 8px;
  width: 80px;
  height: 30px;
  background-color: rgba(200, 200, 200, 0.3);
  color: #fff;
  font-size: 20px;
  /* margin-top: 20px; */
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  /* outline: none;
  padding: 0;
  display: inline-block; */
  &:hover {
    cursor: pointer;
    background-color: rgba(200, 200, 200, 0.2);
  }
`;

export const TextAuth = styled.h1`
  font-size: 18px;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
  color: #2da042;
  text-align: center; 
  letter-spacing: 2px; 
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); 
  margin-top: 35px;
`;