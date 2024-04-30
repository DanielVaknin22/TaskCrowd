import styled from 'styled-components';

export const UserProfile = styled.div`
text-align: left;
margin-top: -25.33px;
`;

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

export const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 15px;
    color: white;
`;

export const UserDetails = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 20px;
`;

export const DateContainer = styled.div`
    flex-shrink: 0;
    // margin-left: -180px;
    margin-top: -15px;
    font-size: 10px;
`;

export const Task = styled.div`
  background-color: rgba(200, 200, 200, 0.05);
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 10px;
  width: 500px;
  box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border: 1.2px solid rgba(255, 255, 255, 0.1);
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

export const PopupContant = styled.div`
    height: flex;
    width: 500px;
    background-color: #3A3B3C;
    padding: 20px;
    border-radius: 15px;
    position: relative;
    text-align: start;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0px 2px 4px rgba(255, 255, 255, 0.1);
    margin-top: 900px;
`;

export const SolveButton = styled.button`
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 15px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    width: 200px;
    height: 37px;
    margin-bottom: 10px;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

export const DeleteBtn = styled.button`
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    // padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    margin-left: 400px;
    margin-top: -50px;
    &:hover{
        cursor: pointer;
        background-color: #8080;
    }
`;

export const TrashBtn = styled.image`
    background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yw/r/hL0ruuDyBXb.png);
    background-position: 0px -340px;
    background-size: 25px 361px;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    display: inline-block;
    cursor: pointer;
    background-color: var(--web-wash);
`;

export const SaveImg = styled.image`
    background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yl/r/hWIpyI8_P8x.png);
    background-position: 0px -83px;
    background-size: 41px 419px;
    width: 20px;
    height: 20px;
    background-repeat: no-repeat;
    display: inline-block;
`;

export const CommentImg = styled.image`
background-image: url(https://static.xx.fbcdn.net/rsrc.php/v3/yg/r/3X2GtQkJp4p.png);
background-position: 0px -592px;
background-size: 25px 1469px;
width: 20px;
height: 20px;
background-repeat: no-repeat;
display: inline-block;
`;