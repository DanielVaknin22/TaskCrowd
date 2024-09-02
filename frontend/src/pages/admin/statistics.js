import React, { useState, useEffect, useCallback } from 'react';
import { UserListContainer, UserItem, Popup, PopupContent, Btn } from './statistics.style';
import jsPDF from 'jspdf';
import { CSVLink } from 'react-csv';

const StatisticsPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [givenTasks, setGivenTasks] = useState([]);
  const [solvedTasks, setSolvedTasks] = useState([]);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/user');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchGivenTasks = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/task/get-tasks/${userId}`);
      if (response.ok) {
        const tasks = await response.json();
        return tasks.length;
      } else {
        console.error('Failed to fetch given tasks:', response.statusText);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching given tasks:', error);
      return 0;
    }
  };

  const fetchSolvedTasks = async (userId) => {
    try {
      const response = await fetch(`http://localhost:3001/task/get-solved-tasks/${userId}`);
      if (response.ok) {
        const tasks = await response.json();
        return tasks.length;
      } else {
        console.error('Failed to fetch solved tasks:', response.statusText);
        return 0;
      }
    } catch (error) {
      console.error('Error fetching solved tasks:', error);
      return 0;
    }
  };

  const fetchUserStatistics = async (userId) => {
    const givenTasksCount = await fetchGivenTasks(userId);
    const solvedTasksCount = await fetchSolvedTasks(userId);
    setGivenTasks(new Array(givenTasksCount).fill({}));
    setSolvedTasks(new Array(solvedTasksCount).fill({}));
  };

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

  const generateCsvData = useCallback(async () => {
    const updatedUsers = await Promise.all(users.map(async (user) => {
      const givenTasksCount = await fetchGivenTasks(user._id);
      const solvedTasksCount = await fetchSolvedTasks(user._id);
      return {
        name: user.name,
        id: user.idNumber,
        email: user.email,
        tasksGiven: givenTasksCount,
        tasksSolved: solvedTasksCount
      };
    }));
    setCsvData(updatedUsers);
  }, [users]);

  useEffect(() => {
    generateCsvData();
  }, [generateCsvData]);

  return (
    <UserListContainer>
      <h2>All Users</h2>
      <CSVLink data={csvData} filename={"users_statistics.csv"}>
        <Btn>Download CSV</Btn>
      </CSVLink>
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
