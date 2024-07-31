import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserProfile, DateContainer, Task, DeleteBtn } from './solveTask/solveTask.style';

const ProfilePage = () => {
    const [auth, setAuth] = useState(null);
    const [givenTasks, setGivenTasks] = useState([]);
    const [solvedTasks, setSolvedTasks] = useState([]);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const authData = localStorage.getItem('user');
        if (authData) {
            const parsedAuthData = JSON.parse(authData);
            console.log('Parsed auth data:', parsedAuthData);
            setAuth(parsedAuthData);
        }
        const userId = localStorage.getItem('userID'); 
        if (userId) {
            setUserID(userId);
        }
        fetchSolvedTasks();
        fetchGivenTasks();
    }, []);
    
    const fetchGivenTasks = async () => {
        try {
            const userId = localStorage.getItem('userID');
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

    const fetchSolvedTasks = async () => {
        try {
            const userId = localStorage.getItem('userID');
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const year = date.getFullYear();
        const monthNames = [
          "January", "February", "March", "April", "May", "June", "July",
          "August", "September", "October", "November", "December"
        ];
        const monthIndex = date.getMonth();
        const month = monthNames[monthIndex];
      
        return `${day} ${month} ${year}`;
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/task/delete-task/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                setGivenTasks(givenTasks.filter(task => task._id !== taskId));
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    return (
        <HomeWrapper>
            {auth && (
                <div>
                    <UserProfile>
                    {/* <h2>User Profile</h2> */}
                    <p style={{ fontWeight: 'bold', fontSize: '25px' }} >Name: {auth.name}</p>
                    <p>Number of Tasks Given: {givenTasks.length}</p>
                    <p>Number of Tasks Solved: {solvedTasks.length}</p>
                    </UserProfile>
                    <TaskContainer>
                    <h3>Tasks Given:</h3>
                        {givenTasks.map(task => (
                            <Task key={task.id}>
                                <p style={{ fontWeight: 'bold' }}>{auth.name}</p>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                {task.userID === userID && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}>🗑️ Delete</DeleteBtn>
                                )}
                                <p style={{ marginTop: '40px' }}>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions are required: {task.numsolution}</p>
                                </Task>
                        ))}
                    </TaskContainer>
                    <TaskContainer>
                    <h3>Tasks Solved:</h3>
                        {solvedTasks.map(task => (
                            <Task key={task.id}>
                                <p style={{ fontWeight: 'bold' }} >Given by: {task.userID.name}</p>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                <p>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions are required: {task.numsolution}</p>
                                 <div>
                                    <h4>Solutions:</h4>
                                    {task.solutions && task.solutions.length > 0 ? (
                                        task.solutions.map((solution, index) => (
                                            <p key={index}>{solution}</p>
                                        ))
                                    ) : (
                                        <p>No solutions available</p>
                                    )}
                                </div>
                                </Task>                        ))}
                    </TaskContainer>
                </div>
            )}
        </HomeWrapper>
    );
};

export default ProfilePage;
