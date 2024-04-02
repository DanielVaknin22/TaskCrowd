import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserDetails, DateContainer, Task, Img, Popup, PopupContant, SolveButton } from './solveTask.style';

const SolveTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [auth, setAuth] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem('user');
        if (authData) {
            setAuth(authData);
        }
        fetchTasksForSolving();
    }, []);

    const fetchTasksForSolving = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/task/solve-tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSolveTask = async (taskId, solution) => {
        try {
            const userId = localStorage.getItem('userID'); 
            const response = await fetch(`http://localhost:3000/task/${taskId}/${userId}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solution })
            });
            if (response.ok) {
                console.log('Task solved successfully');
            } else {
                console.error('Failed to solve task:', response.statusText);
            }
        } catch (error) {
            console.error('Error solving task:', error);
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

    const fetchTaskImages = async (taskId) => {
        try {
          const response = await fetch(`http://localhost:3000/task/get-images/${taskId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch task images');
          }
          const data = await response.json();
          const filepaths = data.filepaths.map(filepath => `http://localhost:3000/${filepath}`);
          console.log(filepaths);
          return filepaths;
        } catch (error) {
          console.error('Error fetching task images:', error);
          return [];
        }
    };
    
      
      useEffect(() => {
        if (selectedTask) {
          fetchTaskImages(selectedTask._id)
            .then(filepaths => setImageUrls(filepaths))
            .catch(error => console.error('Error fetching task images:', error));
        }
      }, [selectedTask]);

    return (
        <HomeWrapper>
            {auth ? (
                <>
                    <h2>Hello!&#128075;<br />
                        Choose task to solve</h2>
                    {loading && <p>Loading tasks...</p>}
                    {!loading && tasks.length === 0 && <p>No tasks available</p>}
                    {tasks.map(task => (
                        <TaskContainer key={task._id}>
                            <Task>
                                <UserDetails><p>{task.userName}</p></UserDetails>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                <p>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions are required: {task.numsolution}</p>
                                <SolveButton onClick={() => {
                                    setSelectedTask(task);
                                    setModalVisible(true);
                                }}>Solve Task</SolveButton>
                                <br />
                            </Task>
                        </TaskContainer>
                    ))}
                    {modalVisible && selectedTask && (
    <Popup>
        <PopupContant>
            <h2>Solve Task</h2>
            <p>User: {selectedTask.userName}</p>
            <DateContainer><p>{formatDate(selectedTask.date)}</p></DateContainer>
            <p>Subject: {selectedTask.subject}</p>
            <p>Type: {selectedTask.type}</p>
            <p>Number of solutions required: {selectedTask.numsolution}</p>
            {selectedTask.type === 'Image classification' && (
                <>
                    <div>
                        <p>Images:</p>
                        {imageUrls.map((url, index) => (
                            <Img key={`${url}-${index}`} src={url} alt={`Image ${index}`} />
                        ))}
                    </div>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const selectedLabels = Array.from(new FormData(e.target).getAll('selectedLabels'));
                        const solutions = [];
                        for (let i = 0; i < selectedLabels.length; i++) {
                            solutions.push(selectedLabels[i]);
                        }
                        handleSolveTask(selectedTask._id, solutions);
                        setModalVisible(false); 
                    }}>
                        <div>
                            <p>Choose the labels:</p>
                            {selectedTask.labels.map((label, index) => (
                                <div key={index}>
                                    <input
                                        type="checkbox"
                                        id={`label-${index}`}
                                        name="selectedLabels"
                                        value={label}
                                    />
                                    <label htmlFor={`label-${index}`}>{label}</label>
                                </div>
                            ))}
                        </div>
                        <div style={{ display: 'flex',   flexDirection: 'column', marginTop: '10px' }}>
                        <SolveButton type="submit">Save</SolveButton>
                        <SolveButton onClick={() => setModalVisible(false)}>Close</SolveButton>
                        </div>
                    </form>
                </>
            )}
        </PopupContant>
    </Popup>
)}

                </>
            ) : (
                <h2>
                </h2>
            )}
        </HomeWrapper>
    );
};

export default SolveTasksPage;
