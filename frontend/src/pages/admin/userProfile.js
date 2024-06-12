import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserProfile, DateContainer, Task, DeleteBtn, TrashBtn } from '../solveTask/solveTask.style';
import { useParams } from 'react-router-dom';

const ProfilePage = () => {
    const [auth, setAuth] = useState(null);
    const [givenTasks, setGivenTasks] = useState([]);
    const [solvedTasks, setSolvedTasks] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`http://localhost:3000/user/${id}`);
                const data = await response.json();
                setAuth(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        const fetchGivenTasks = async () => {
            try {
                const response = await fetch(`http://localhost:3000/task/get-tasks/${id}`);
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
                const response = await fetch(`http://localhost:3000/task/get-solved-tasks/${id}`);
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

        fetchUser();
        fetchSolvedTasks();
        fetchGivenTasks();
    }, [id]);

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
                // Remove the deleted task from the state
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
                        <p style={{ fontWeight: 'bold', fontSize: '25px' }}>Name: {auth.name}</p>
                        <p>Number of Tasks Given: {givenTasks.length}</p>
                        <p>Number of Tasks Solved: {solvedTasks.length}</p>
                    </UserProfile>
                    <TaskContainer>
                        <h3>Tasks Given:</h3>
                        {givenTasks.map(task => (
                            <Task key={task._id}>
                                <p style={{ fontWeight: 'bold' }}>{auth.name}</p>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                {task.userID === id && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}> <TrashBtn></TrashBtn> Delete</DeleteBtn>
                                )}
                                <p style={{ marginTop: '40px' }}>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions required: {task.numsolution}</p>
                            </Task>
                        ))}
                    </TaskContainer>
                    <TaskContainer>
                        <h3>Tasks Solved:</h3>
                        {solvedTasks.map(task => (
                            <Task key={task._id}>
                                <p style={{ fontWeight: 'bold' }}>Given by: {task.userID.name}</p>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                <p>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions required: {task.numsolution}</p>
                            </Task>
                        ))}
                    </TaskContainer>
                </div>
            )}
        </HomeWrapper>
    );
};

export default ProfilePage;
