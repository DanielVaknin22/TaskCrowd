import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserDetails, DateContainer, Task, Popup, PopupContant,
    SolveButton, DeleteBtn, TrashBtn, SaveImg, CommentImg, Btn, TextInput,
PlusImg } from './solveTask.style';

const SolveTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [auth, setAuth] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null);
    const [formData, setFormData] = useState({
        labels: [],
      });

    useEffect(() => {
        const authData = localStorage.getItem('user');
        const userId = localStorage.getItem('userID'); 
        if (authData) {
            setAuth(authData);
        }
        if (userId) {
            setUserID(userId);
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

    const handleAddLabel = () => {
        setFormData({
          ...formData,
          labels: [...formData.labels, '']
        });
    };

    const handleLabelChange = (index, value) => {
        const newLabels = [...formData.labels];
        newLabels[index] = value;
        setFormData({
          ...formData,
          labels: newLabels
        });
      };

    const handleSolveTask = async (taskId, solutions, labels) => {
        try {
            const userId = localStorage.getItem('userID'); 
            const response = await fetch(`http://localhost:3000/task/${taskId}/${userId}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solution: labels, labels: [...selectedTask.labels, ...formData.labels] })
            });
            if (response.ok) {
                console.log('labels:', labels);
                console.log('Task solved successfully');
                setFormData({ labels: [] });
                setModalVisible(false);
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

    const handleCloseModal = () => {
        setModalVisible(false);
        setFormData({ labels: [] });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            images: files,
        });
    };
   
    

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:3000/task/delete-task/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                // Remove the deleted task from the state
                setTasks(tasks.filter(task => task._id !== taskId));
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
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
                    <h2>Choose task to solve</h2>
                    {loading && <p>Loading tasks...</p>}
                    {!loading && tasks.length === 0 && <p>No tasks available</p>}
                    {tasks.map(task => (
                        <TaskContainer key={task._id}>
                            <Task>
                                <UserDetails><p>{task.userName}</p></UserDetails>
                                <DateContainer><p>{formatDate(task.date)}</p></DateContainer>
                                {task.userID === userID && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}> <TrashBtn></TrashBtn> Delete</DeleteBtn>
                                )}
                                <p style={{ marginTop: '40px' }}>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions are required: {task.numsolution}</p>
                                <SolveButton onClick={() => {
                                    setSelectedTask(task);
                                    setModalVisible(true);
                                }}><CommentImg></CommentImg>  Solve Task</SolveButton>
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
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const selectedLabels = imageUrls.map((url, index) => {
                            const selectedLabel = formData.get(`selectedLabels-${index}`);
                            return { image_url: url, label: selectedLabel };
                        });
                        const solutions = imageUrls.map((url, index) => selectedTask.images[index]);
                        handleSolveTask(selectedTask._id, solutions, selectedLabels);
                        setModalVisible(false); 
                    }}>

                {imageUrls.map((url, index) => (
                    <div key={index}>
                        <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />
                    <div>
                        {selectedTask.labels.map((label, labelIndex) => (
                        <div key={labelIndex}>
                            <input
                            type="radio"
                            id={`label-${index}-${labelIndex}`}
                            name={`selectedLabels-${index}`}
                            value={label}
                            />
                            <label htmlFor={`label-${index}-${labelIndex}`}>{label}</label>
                        </div>
                        ))}
                    </div>
                    </div>
                ))}
                
                <div style={{ display: 'flex',   flexDirection: 'column', marginTop: '10px' }}>
                <SolveButton type="submit"> <SaveImg></SaveImg> Save</SolveButton>
                <SolveButton onClick={handleCloseModal}>Close</SolveButton>
                </div>
                </form>
                </>
                            )}
                            {selectedTask.type === 'Text cataloging' && (
                                <>
                                <p>Text: {selectedTask.text}</p>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSolveTask(selectedTask._id, [], formData.labels);
                                setModalVisible(false);
                            }}>

                            <Btn style={{width: '100px'}} type="button" onClick={handleAddLabel}> <PlusImg>+</PlusImg> Add Label</Btn>
                                {formData.labels.map((label, index) => (
                                <div key={index}>
                                    <label htmlFor={`label-${index}`}>Label {index + 1}:</label>
                                    <TextInput
                                    type="text"
                                    id={`label-${index}`}
                                    value={label}
                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                    required
                                    />
                                </div>
                                ))}
                                <div>
                                    <SolveButton type="submit"> <SaveImg /> Save</SolveButton>
                                    <SolveButton onClick={handleCloseModal}>Close</SolveButton>
                                </div>
                            </form>
                            </>
                        )}

                {selectedTask.type === 'Image cataloging' && (
                    <>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const selectedLabels = imageUrls.map((url, index) => {
                            const selectedLabel = formData.get(`selectedLabels-${index}`);
                            return { image_url: url, label: selectedLabel };
                        });
                        const solutions = imageUrls.map((url, index) => selectedTask.images[index]); 
                        handleSolveTask(selectedTask._id, solutions, selectedLabels);
                        setModalVisible(false); 
                    }}>

                {imageUrls.map((url, index) => (
                    <div key={index}>
                        <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />
                                <div>
                                <label htmlFor={`label-${index}`}>Label:</label>
                                    <TextInput
                                    type="text"
                                    id={`label-${index}`}
                                    value={formData.labels[index] || ''}
                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                    required
                                    />
                                </div>
                                
                </div>
                ))}
                <div style={{ display: 'flex',   flexDirection: 'column', marginTop: '10px' }}>
                <SolveButton type="submit"> <SaveImg></SaveImg> Save</SolveButton>
                <SolveButton onClick={handleCloseModal}>Close</SolveButton>
                </div>
                </form>
                </>
                )}

                {selectedTask.type === 'Label classification' && (
                                    <>
                                    <form onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.target);
                                        const selectedLabels = imageUrls.map((url, index) => {
                                            const selectedLabel = formData.get(`selectedLabels-${index}`);
                                            return { image_url: url, label: selectedLabel };
                                        });
                                        const solutions = imageUrls.map((url, index) => selectedTask.images[index]); 
                                        handleSolveTask(selectedTask._id, solutions, selectedLabels);
                                        setModalVisible(false); 
                                    }}>

                                {imageUrls.map((url, index) => (
                                    <div key={index}>
                                        <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />
                                                <div>
                                                <label htmlFor={`label-${index}`}>Label:</label>
                                                    <TextInput
                                                    type="text"
                                                    id={`label-${index}`}
                                                    value={formData.labels[index] || ''}
                                                    onChange={(e) => handleLabelChange(index, e.target.value)}
                                                    required
                                                    />
                                                </div>
                                                
                                </div>
                                ))}

<div>
                                                <p>Label: {selectedTask.label}</p>
                                                
                                            </div>
                                 <div>
                <label htmlFor="images">Upload Images: </label>
                <TextInput
                    type="file"
                    id="images"
                    name="images"
                    accept="image/*"
                    onChange={handleImageChange}
                    multiple
                    required
                />
            </div>
                                <div style={{ display: 'flex',   flexDirection: 'column', marginTop: '10px' }}>
                                <SolveButton type="submit"> <SaveImg></SaveImg> Save</SolveButton>
                                <SolveButton onClick={handleCloseModal}>Close</SolveButton>
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
