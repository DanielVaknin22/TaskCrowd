import React, { useState, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { HomeWrapper, TaskContainer, UserProfile, DateContainer, Task, DeleteBtn, NextBtn, SolveButton } from './solveTask/solveTask.style';

const formatImagePath = (path) => path.replace(/\\/g, '/');

const ProfilePage = () => {
    const [auth, setAuth] = useState(null);
    const [givenTasks, setGivenTasks] = useState([]);
    const [solvedTasks, setSolvedTasks] = useState([]);
    const [userID, setUserID] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState({});

    const fetchGivenTasks = useCallback(async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3001/task/get-tasks/${userId}`);
            if (response.ok) {
                let tasks = await response.json();
                tasks = await fetchTaskImages(tasks);
                setGivenTasks(tasks);
            } else {
                console.error('Failed to fetch given tasks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching given tasks:', error);
        }
    }, []);

    useEffect(() => {
        const authData = localStorage.getItem('user');
        if (authData) {
            const parsedAuthData = JSON.parse(authData);
            setAuth(parsedAuthData);
        }
        const userId = localStorage.getItem('userID');
        if (userId) {
            setUserID(userId);
        }
        fetchSolvedTasks();
        fetchGivenTasks();
    }, [fetchGivenTasks]);

    const fetchSolvedTasks = async () => {
        try {
            const userId = localStorage.getItem('userID');
            const response = await fetch(`http://localhost:3001/task/get-solved-tasks/${userId}`);
            if (response.ok) {
                let tasks = await response.json();
                tasks = await Promise.all(tasks.map(async (task) => {
                    const solutionFetchPromises = task.solutions.map(async (solution) => {
                        const imagesResponse = await fetch(`http://localhost:3001/task/get-images/${solution._id}`);
                        if (imagesResponse.ok) {
                            const images = await imagesResponse.json();
                            return { ...solution, images };
                        }
                        return solution;
                    });

                    task.solutions = await Promise.all(solutionFetchPromises);
                    return task;
                }));
                setSolvedTasks(tasks);
                const initialImageIndexes = tasks.reduce((acc, task) => {
                    if (task.solutions.length > 0) {
                        acc[task._id] = task.solutions.map(() => 0);
                    }
                    return acc;
                }, {});
                setCurrentImageIndex(initialImageIndexes);
                    } else {
                console.error('Failed to fetch solved tasks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching solved tasks:', error);
        }
    };

    const fetchTaskImages = async (tasks) => {
        const imageFetchPromises = tasks.map(async (task) => {
            try {
                const response = await fetch(`http://localhost:3001/task/get-images/${task._id}`);
                if (response.ok) {
                    const data = await response.json();
                    if (Array.isArray(data.filepaths)) {
                        return {
                            ...task,
                            images: data.filepaths.map(path => ({
                                filePath: formatImagePath(path)
                            }))
                        };
                    } else {
                        console.error(`Unexpected response format for task ${task._id}:`, data);
                        return { ...task, images: [] };
                    }
                } else {
                    console.error(`Failed to fetch images for task ${task._id}:`, response.statusText);
                    return { ...task, images: [] };
                }
            } catch (error) {
                console.error(`Error fetching images for task ${task._id}:`, error);
                return { ...task, images: [] };
            }
        });
    
        return Promise.all(imageFetchPromises);
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
            const response = await fetch(`http://localhost:3001/task/delete-task/${taskId}`, {
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

    const handleNextImage = (taskId, solutionIndex) => {
        setCurrentImageIndex(prevState => {
            const task = solvedTasks.find(task => task._id === taskId);
            if (!task || !task.solutions[solutionIndex]) return prevState;
            const updatedIndexes = [...(prevState[taskId] || [])];
            updatedIndexes[solutionIndex] = (updatedIndexes[solutionIndex] + 1) % (task.solutions[solutionIndex]?.solution?.length || 1);
            return { ...prevState, [taskId]: updatedIndexes };
        });
    };
    

    const handlePreviousImage = (taskId, solutionIndex) => {
        setCurrentImageIndex(prevState => {
            const task = solvedTasks.find(task => task._id === taskId);
            if (!task || !task.solutions[solutionIndex]) return prevState;
            const updatedIndexes = [...(prevState[taskId] || [])];
            updatedIndexes[solutionIndex] = (updatedIndexes[solutionIndex] - 1 + (task.solutions[solutionIndex]?.solution?.length || 1)) % (task.solutions[solutionIndex]?.solution?.length || 1);
            return { ...prevState, [taskId]: updatedIndexes };
        });
    };

    const handleDownloadTaskData = async (task) => {
        const zip = new JSZip();
        const folder = zip.folder(task.subject || 'task_data');
        const csvContent = [];
        
        // Fetch user IDs from solutions
        const userIds = [...new Set(task.solutions.map(solution => solution.userID))];
        
        // Fetch user names from the server
        const response = await fetch('http://localhost:3001/user/getUserNames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIds }),
        });
        
        if (!response.ok) {
            console.error("Failed to fetch user names");
            return;
        }
        
        const users = await response.json();
        const userMap = users.reduce((acc, user, index) => {
            // Map user IDs to anonymized identifiers
            acc[user._id] = `user${index + 1}`;
            return acc;
        }, {});
        
        if (task.type === 'Text cataloging') {
            csvContent.push('User ID,Text,Label');
        
            for (const solution of task.solutions) {
                const userID = userMap[solution.userID];
                for (const label of solution.solution) {
                    csvContent.push(`${userID},"${task.text}",${label}`);
                }
            }
        
            const csvData = csvContent.join('\n');
            folder.file('text_solutions.csv', csvData);
        } else if (task.type === 'Label classification') {
            csvContent.push('Image Name,User ID,Label');
        
            for (const solution of task.solutions) {
                const userID = userMap[solution.userID];
                for (const [index, item] of solution.solution.entries()) {
                    if (item.image_url) {
                        try {
                            const response = await fetch(item.image_url);
                            if (response.ok) {
                                const blob = await response.blob();
        
                                const imageName = `image_${index + 1}.jpg`;
                                folder.file(imageName, blob);
        
                                const label = item.label || '';
                                csvContent.push(`${imageName},${userID},${label}`);
                            } else {
                                console.error(`Failed to fetch image: ${item.image_url}`);
                            }
                        } catch (error) {
                            console.error(`Failed to fetch image: ${item.image_url}`, error);
                        }
                    }
                }
            }
            const csvData = csvContent.join('\n');
            folder.file('image_solutions.csv', csvData);
        } else {
            const imagesData = [];
        
            for (const solution of task.solutions) {
                const userID = userMap[solution.userID];
        
                for (const [index, item] of solution.solution.entries()) {
                    const response = await fetch(item.image_url);
                    const blob = await response.blob();
        
                    const imageName = `image_${index + 1}.jpg`;
                    folder.file(imageName, blob);
        
                    imagesData.push({ imageName, userID, label: item.label });
                }
            }
        
            imagesData.sort((a, b) => a.imageName.localeCompare(b.imageName));
        
            imagesData.forEach(({ imageName, userID, label }) => {
                csvContent.push(`${imageName},${userID},${label}`);
            });
        
            const csvHeader = 'Image Name,User ID,Label\n';
            const csvData = csvHeader + csvContent.join('\n');
            folder.file('solutions.csv', csvData);
        }
        
        zip.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(content, `${task.subject || 'task'}_data.zip`);
        });
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
                                {task.userID === userID && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}>🗑️ Delete</DeleteBtn>
                                )}
                                <p style={{ marginTop: '40px' }}>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions required: {task.numsolution}</p>
                                <div>
                                    <h4>Solutions:</h4>
                                    <SolveButton onClick={() => handleDownloadTaskData(task)}>Download Solutions</SolveButton>
                                    {task.solutions && task.solutions.length > 0 ? (
                                        task.solutions.map((solution, solutionIndex) => (
                                            <div key={solutionIndex} style={{ marginBottom: '20px' }}>
                                                <p><strong>Solution {solutionIndex + 1}:</strong></p>
                                                {task.type === 'Text cataloging' ? (
                                                    <div>
                                                        <p>Text: {task.text}</p>
                                                        <p>Solution: {solution.solution.join(', ')}</p>
                                                    </div>
                                                ) : (
                                                    solution.solution && solution.solution.length > 0 ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <NextBtn onClick={() => handlePreviousImage(task._id, solutionIndex)}>←</NextBtn>
                                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                                {solution.solution.map((item, itemIndex) => (
                                                                    (currentImageIndex[task._id]?.[solutionIndex] === itemIndex) && (
                                                                        <div key={itemIndex} style={{ marginBottom: '20px' }}>
                                                                            <img
                                                                                style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '10px' }}
                                                                                src={item.image_url}
                                                                                alt={`Solution ${solutionIndex} ${itemIndex}`}
                                                                            />
                                                                            {item.label && (
                                                                                <div>
                                                                                    {Array.isArray(item.label) ? (
                                                                                        item.label.map((label, labelIndex) => (
                                                                                            <div key={labelIndex}>
                                                                                                <label style={{ fontSize: '20px' }} htmlFor={`label-${solutionIndex}-${itemIndex}-${labelIndex}`}>
                                                                                                    {label}
                                                                                                </label>
                                                                                            </div>
                                                                                        ))
                                                                                    ) : (
                                                                                        <label style={{ fontSize: '20px' }} htmlFor={`label-${solutionIndex}-${itemIndex}`}>
                                                                                            {item.label}
                                                                                        </label>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                            <NextBtn onClick={() => handleNextImage(task._id, solutionIndex)}>→</NextBtn>
                                                        </div>
                                                    ) : (
                                                        <p>No images available</p>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No solutions available</p>
                                    )}
                                </div>
                            </Task>
                        ))}
                    </TaskContainer>
                    <TaskContainer>
                        <h3>Tasks Solved:</h3>
                        {solvedTasks.map((task) => (
                            <Task key={task._id}>
                                <p style={{ fontWeight: 'bold' }}>Given by: {task.userID.name}</p>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                <p>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions required: {task.numsolution}</p>
                                <div>
                                    <h4>Solutions:</h4>
                                    {task.solutions && task.solutions.length > 0 ? (
                                        task.solutions.map((solution, solutionIndex) => (
                                            <div key={solutionIndex} style={{ marginBottom: '20px' }}>
                                                <p><strong>Solution {solutionIndex + 1}:</strong></p>
                                                {task.type === 'Text cataloging' ? (
                                                    <div>
                                                        <p>Text: {task.text}</p>
                                                        <p>Solution: {solution.solution.join(', ')}</p>
                                                    </div>
                                                ) : (
                                                    solution.solution && solution.solution.length > 0 ? (
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <NextBtn onClick={() => handlePreviousImage(task._id, solutionIndex)}>←</NextBtn>
                                                            <div style={{ flex: 1, textAlign: 'center' }}>
                                                                {solution.solution.map((item, itemIndex) => (
                                                                    (currentImageIndex[task._id]?.[solutionIndex] === itemIndex) && (
                                                                        <div key={itemIndex} style={{ marginBottom: '20px' }}>
                                                                            <img
                                                                                style={{ width: '200px', height: 'auto', display: 'block', marginBottom: '10px' }}
                                                                                src={item.image_url}
                                                                                alt={`Solution ${solutionIndex} ${itemIndex}`}
                                                                            />
                                                                            {item.label && (
                                                                                <div>
                                                                                    {Array.isArray(item.label) ? (
                                                                                        item.label.map((label, labelIndex) => (
                                                                                            <div key={labelIndex}>
                                                                                                <label style={{ fontSize: '20px' }} htmlFor={`label-${solutionIndex}-${itemIndex}-${labelIndex}`}>
                                                                                                    {label}
                                                                                                </label>
                                                                                            </div>
                                                                                        ))
                                                                                    ) : (
                                                                                        <label style={{ fontSize: '20px' }} htmlFor={`label-${solutionIndex}-${itemIndex}`}>
                                                                                            {item.label}
                                                                                        </label>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                            <NextBtn onClick={() => handleNextImage(task._id, solutionIndex)}>→</NextBtn>
                                                        </div>
                                                    ) : (
                                                        <p>No images available</p>
                                                    )
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p>No solutions available</p>
                                    )}
                                </div>
                            </Task>
                        ))}
                    </TaskContainer>
                </div>
            )}
        </HomeWrapper>
    );    
};

export default ProfilePage;
