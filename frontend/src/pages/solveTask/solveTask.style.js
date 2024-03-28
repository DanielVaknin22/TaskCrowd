import styled from 'styled-components';

export const HomeWrapper = styled.div`
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    text-align: center;
    background-color: rgba(0, 0, 0 , .9);
    min-height: 120vh;
    flex-direction: column;
    justify-content: center;
    margin-top: -20px;
    font-family: Verdana, Helvetica, sans-serif;
    color: white;
`;

export const TaskContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-family: Verdana, Helvetica, sans-serif;
    font-size: 15px;
    color: white;
`;

export const UserDetails = styled.div`
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 16px

`;

export const DateContainer = styled.div`
    flex-shrink: 0;
    // margin-left: -180px;
    margin-top: -20px;
    font-size: 10px;
`;

export const STitle = styled.h3`
    color: #2da042;
`;

export const PostContent = styled(STitle)`
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  margin-top: 10px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  word-break: break-word;
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