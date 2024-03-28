import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserDetails, DateContainer, Task } from './solveTask.style';

const SolveTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [auth, setAuth] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const authData = localStorage.getItem('user');
        if (authData) {
            setAuth(authData);
        }
        fetchTasksForSolving();
    }, []);

    const fetchTasksForSolving = async () => {
        try {
            const response = await fetch('http://localhost:3000/task/solve-tasks');
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Failed to fetch tasks:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSolveTask = async (taskId, solution) => {
        try {
            const response = await fetch(`http://localhost:3000/task/${taskId}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solution })
            });
            if (response.ok) {
                console.log('Task solved successfully');
                // You can update the UI to reflect that the task has been solved
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

    return (
        <HomeWrapper>
             {auth ? (
                <>
            <h2>Hello!&#128075;<br />
            Choose task to solve</h2>
            {tasks && tasks.map(task => (
                <TaskContainer>
                    <Task key={task._id}>
                        <UserDetails><p>{task.userName}</p></UserDetails>
                        <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                        <p>Subject: {task.subject}</p>
                        <p>Type: {task.type}</p>
                        <p>Number of solutions are required: {task.numsolution}</p>
                        <button onClick={() => {
                            setSelectedTask(task);
                            setModalVisible(true);
                        }}>Solve Task</button>
                        <br/>
                    </Task>
                </TaskContainer>
            ))}
            {modalVisible && selectedTask && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Solve Task</h2>
                        <p>User: {selectedTask.userName}</p>
                        <p>Date: {formatDate(selectedTask.date)}</p>
                        <p>Subject: {selectedTask.subject}</p>
                        <p>Type: {selectedTask.type}</p>
                        <p>Number of solutions required: {selectedTask.numsolution}</p>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const solution = e.target.elements.solution.value;
                            handleSolveTask(selectedTask._id, solution);
                            setModalVisible(false); // Close the modal after submitting the solution
                        }}>
                            <label htmlFor="solution">Your Solution:</label>
                            <textarea id="solution" name="solution" required />
                            <button type="submit">Submit Solution</button>
                        </form>
                        <button onClick={() => setModalVisible(false)}>Close</button>
                    </div>
                </div>
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
