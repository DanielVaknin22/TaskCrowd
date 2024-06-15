// StatisticsPage.js
import React, { useState, useEffect } from 'react';
import { UserListContainer, UserItem, Popup, PopupContent, Btn } from './statistics.style';
import jsPDF from 'jspdf';


const StatisticsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [givenTasks, setGivenTasks] = useState([]);
  const [solvedTasks, setSolvedTasks] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/user'); 
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

//   const fetchUserStatistics = async (userId) => {
//     try {
//       const response = await fetch(`http://localhost:3000/users/${userId}/statistics`); 
//       const data = await response.json();
//       setStatistics(data);
//     } catch (error) {
//       console.error('Error fetching user statistics:', error);
//     }
//   };

  const fetchGivenTasks = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/task/get-tasks/${userId}`);
        if (response.ok) {
            const tasks = await response.json();
            setGivenTasks(tasks);
        } else {
            console.error('Failed to fetch given tasks:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching given tasks:', error);
    }
};

const fetchSolvedTasks = async (userId) => {
    try {
        const response = await fetch(`http://localhost:3000/task/get-solved-tasks/${userId}`);
        if (response.ok) {
            const data = await response.json();
            setSolvedTasks(data);
        } else {
            console.error('Failed to fetch tasks:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

const fetchUserStatistics = (userId) => {
    fetchSolvedTasks(userId);
    fetchGivenTasks(userId);
}

  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchUserStatistics(user._id);
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
    setSelectedUser(null);
  };

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    doc.text(`User: ${selectedUser.name}`, 10, 10);
    doc.text(`Tasks Given: ${givenTasks.length}`, 10, 20);
    doc.text(`Tasks Solved: ${solvedTasks.length}`, 10, 30);
    doc.save(`${selectedUser.name}_statistics.pdf`);
  };

  return (
    <UserListContainer>
      <h2>All Users</h2>
      {users.map(user => (
        <UserItem key={user._id} onClick={() => handleUserClick(user)}>
          {user.name} - {user.email}
        </UserItem>
      ))}
      {popupVisible && (
        <Popup>
          <PopupContent>
            <h3>{selectedUser.name}'s Statistics</h3>
            <p>Tasks Given: {givenTasks.length}</p>
            <p>Tasks Solved: {solvedTasks.length}</p>
            <Btn onClick={handleDownloadPdf}>Download PDF</Btn>
            <Btn onClick={handleClosePopup}>Close</Btn>
          </PopupContent>
        </Popup>
      )}
    </UserListContainer>
  );
};

export default StatisticsPage;
