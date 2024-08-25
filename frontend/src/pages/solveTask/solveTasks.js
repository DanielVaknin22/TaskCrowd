import React, { useState, useEffect } from 'react';
import { HomeWrapper, TaskContainer, UserDetails, DateContainer, Task, Popup, PopupContant,
    SolveButton, DeleteBtn, Btn, TextInput, NextBtn } from './solveTask.style';

const SolveTasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [auth, setAuth] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageUrls, setImageUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null);
    const [rolee, setRolee] = useState(null);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [formData, setFormData] = useState({
        labels: [],
        images: [],
    });
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const authData = localStorage.getItem('user');
        const userId = localStorage.getItem('userID'); 
        const role = localStorage.getItem('role');
        if (authData) {
            setAuth(authData);
        }
        if (userId) {
            setUserID(userId);
        }
        if (role) {
            setRolee(role);
        }
        fetchTasksForSolving();
    }, []);

    const fetchTasksForSolving = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://185.159.109.243:3001/task/solve-tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            const availableTasks = data.filter(task => task.numsolution > (task.solutions ? task.solutions.length : 0));
            setTasks(availableTasks);
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
            console.log('solutions:', solutions);
            console.log('labels:', labels);
            const response = await fetch(`http://185.159.109.243:3001/task/${taskId}/${userId}/solve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ solution: labels, labels: [...selectedTask.labels, ...formData.labels] })
            });
            if (response.ok) {
                console.log('labels:', labels);
                console.log('Task solved successfully');
                alert('Task solved successfully');
                setFormData({ labels: [] });
                setModalVisible(false);
                fetchTasksForSolving();
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
            const response = await fetch(`http://185.159.109.243:3001/task/get-images/${taskId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch task images');
            }
            const data = await response.json();
            const filepaths = data.filepaths.map(filepath => `http://185.159.109.243:3001/${filepath}`);
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
        const urls = files.map(file => URL.createObjectURL(file));
        setFormData({
            ...formData,
            images: files,
        });
        setImageUrls(urls);
    };

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://185.159.109.243:3001/task/delete-task/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                alert('Task deleted successfully');
                setTasks(tasks.filter(task => task._id !== taskId));
            } else {
                throw new Error('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task');
        }
    };

    const handleDeleteLabel = (index) => {
        const newLabels = formData.labels.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            labels: newLabels
        });
    };
    const handleDeleteImage = async (taskId, imageUrl, index) => {
        try {
            const normalizedImageUrl = imageUrl.replace(/\\/g, '/');
            console.log('Attempting to delete image with taskId:', taskId, 'and imageUrl:', normalizedImageUrl);
    
            const response = await fetch('http://185.159.109.243:3001/task/delete-image', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId: String(taskId), imageUrl: normalizedImageUrl }),
            });
    
            if (!response.ok) {
                throw new Error(`Failed to delete image: ${response.statusText}`);
            }
    
            setImageUrls(prevState => prevState.filter((_, i) => i !== index));
            alert('Image deleted successfully');
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };        
  
    const handleEditTask = async (taskId, updatedTaskData) => {
        try {
            const response = await fetch(`http://185.159.109.243:3001/task/update-task/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTaskData),
            });
    
            if (response.ok) {
                console.log('Task updated successfully');
                alert('Task updated successfully');
                setEditModalVisible(false);
                fetchTasksForSolving();
            } else {
                console.error('Failed to update task:', response.statusText);
            }
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };
    

    useEffect(() => {
        if (selectedTask) {
            fetchTaskImages(selectedTask._id)
                .then(filepaths => setImageUrls(filepaths))
                .catch(error => console.error('Error fetching task images:', error));
        }
    }, [selectedTask]);

    const openEditModal = (task) => {
        setSelectedTask(task);
        setFormData({
            labels: task.labels || [],
            subject: task.subject,
            numsolution: task.numsolution,
            text: task.text || '',
            images: [],
        });
        setEditModalVisible(true);
    };

    const handleFieldChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1));
    };

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
                                {task.userID === userID && rolee !== 'admin' && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}>🗑️ Delete</DeleteBtn>
                                )}
                                {rolee === 'admin' && (
                                    <DeleteBtn onClick={() => handleDeleteTask(task._id)}>
                                        🗑️ Delete </DeleteBtn>
                                )}
                                <p style={{ marginTop: '40px' }}>Subject: {task.subject}</p>
                                <p>Type: {task.type}</p>
                                <p>Number of solutions are required: {task.numsolution}</p>
                                <SolveButton onClick={() => {
                                    setSelectedTask(task);
                                    setModalVisible(true);
                                }}>💬 Solve Task</SolveButton>
                                {task.userID === userID && rolee !== 'admin' && (
                                <SolveButton onClick={() => openEditModal(task)}>✏️ Edit Task</SolveButton>
                                )}
                                {rolee === 'admin' && (
                                <SolveButton onClick={() => openEditModal(task)}>✏️ Edit Task</SolveButton>
                                )}
                                <br />
                            </Task>
                        </TaskContainer>
                    ))}
                      {editModalVisible && selectedTask && (
                        <Popup>
                            <PopupContant>
                                <h2>Edit Task</h2>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const updatedTaskData = {
                                        subject: formData.subject,
                                        numsolution: formData.numsolution,
                                        labels: formData.labels,
                                        images: formData.images,
                                        text: formData.text,
                                    };
                                    handleEditTask(selectedTask._id, updatedTaskData);
                                }}>
                                    <div>
                                        <label>Subject:</label>
                                        <TextInput
                                            type="text"
                                            value={formData.subject}
                                            onChange={(e) => handleFieldChange('subject', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label>Number of solutions:</label>
                                        <TextInput
                                            type="number"
                                            value={formData.numsolution}
                                            onChange={(e) => handleFieldChange('numsolution', e.target.value)}
                                        />
                                    </div>
                                    {selectedTask.type === 'Image classification' && (
                                        <>
                                            <div>
                                                <label>Labels:</label>
                                                {formData.labels.map((label, index) => (
                                                    <div key={index}>
                                                        <TextInput
                                                            type="text"
                                                            value={label}
                                                            onChange={(e) => handleLabelChange(index, e.target.value)}
                                                        />
                                                        <DeleteBtn onClick={() => handleDeleteLabel(index)}>Delete</DeleteBtn>
                                                    </div>
                                                ))}
                                                <Btn onClick={handleAddLabel}>➕ Add Label</Btn>
                                            </div>
                                            <div>
                                                <label>Images:</label>
                                                {imageUrls.map((url, index) => (
                                                    <div key={index}>
                                            <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />
                                                        <DeleteBtn onClick={() => handleDeleteImage(selectedTask._id, imageUrls._id, index)}>Delete</DeleteBtn>
                                                    </div>
                                                ))}
                                                <input type="file" multiple onChange={handleImageChange} />
                                            </div>
                                        </>
                                    )}
                                    {selectedTask.type === 'Image cataloging' && (
                                        <>
                                            <div>
                                                <label>Images:</label>
                                                {imageUrls.map((url, index) => (
                                                    <div key={index}>
                                            <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />
                                            <DeleteBtn onClick={() => handleDeleteImage(selectedTask._id, url, index)}>Delete</DeleteBtn>
                                                    </div>
                                                ))}
                                                <input type="file" multiple onChange={handleImageChange} />
                                            </div>
                                        </>
                                    )}
                                    {selectedTask.type === 'Text cataloging' && (
                                        <div>
                                            <label>Text:</label>
                                            <textarea
                                                value={formData.text}
                                                onChange={(e) => handleFieldChange('text', e.target.value)}
                                            />
                                        </div>
                                    )}
                                    {selectedTask.type === 'Label classification' && (
                                        <div>
                                            <label>Labels:</label>
                                            {formData.labels.map((label, index) => (
                                                <div key={index}>
                                                    <TextInput
                                                        type="text"
                                                        value={label}
                                                        onChange={(e) => handleLabelChange(index, e.target.value)}
                                                    />
                                                    <DeleteBtn onClick={() => handleDeleteLabel(index)}>Delete</DeleteBtn>
                                                </div>
                                            ))}
                                            <Btn onClick={handleAddLabel}>➕ Add Label</Btn>
                                        </div>
                                    )}
                                    <Btn type="submit">💾 Save</Btn>
                                    <Btn type="button" onClick={() => setEditModalVisible(false)}>Cancel</Btn>
                                </form>
                            </PopupContant>
                        </Popup>
                    )}
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
        {imageUrls.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>                
                <NextBtn onClick={handlePrevImage}>←</NextBtn>
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
                }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {imageUrls.map((url, index) => (
                        <div key={index} style={{ display: index === currentImageIndex ? 'block' : 'none' }}>
                            <div style={{ marginTop: '10px' }}>
                                   {index + 1} of {imageUrls.length}
                            </div>
                            <img style={{ width: '200px', height: 'auto', margin: '0 20px' }} src={url} alt={`${index}`} />
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
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                        <SolveButton type="submit">💾 Complete</SolveButton>
                        <SolveButton onClick={handleCloseModal}>Close the window</SolveButton>
                    </div>
                </form>
                <NextBtn onClick={handleNextImage}>→</NextBtn>
            </div>
        )}
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

                                                <Btn style={{width: '100px'}} type="button" onClick={handleAddLabel}>➕ Add Label</Btn>
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
                                                        <SolveButton type="submit">💾 Complete</SolveButton>
                                                        <SolveButton onClick={handleCloseModal}>Close the window</SolveButton>
                                                    </div>
                                                </form>
                                                </>
                                            )}

{selectedTask.type === 'Image cataloging' && (
    <>
        {imageUrls.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <NextBtn onClick={handlePrevImage}>←</NextBtn>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        const selectedLabels = imageUrls.map((url, index) => {
                            const selectedLabel = formData.get(`label-${index}`);
                            return { image_url: url, label: selectedLabel };
                        });
                        const solutions = imageUrls.map((url, index) => selectedTask.images[index]);
                        handleSolveTask(selectedTask._id, solutions, selectedLabels);
                        setModalVisible(false);
                    }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                >
                    {imageUrls.map((url, index) => (
                        <div key={index} style={{ display: index === currentImageIndex ? 'block' : 'none' }}>
                            <div style={{ marginTop: '10px' }}>
                                   {index + 1} of {imageUrls.length}
                            </div>
                            <img style={{ width: '200px', height: 'auto', margin: '0 20px' }} src={url} alt={`${index}`} />
                            <div>
                                <label htmlFor={`label-${index}`}>Label:</label>
                                <TextInput
                                    type="text"
                                    id={`label-${index}`}
                                    name={`label-${index}`}
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                        <SolveButton type="submit">💾 Complete</SolveButton>
                        <SolveButton onClick={handleCloseModal}>Close the window</SolveButton>
                    </div>
                </form>
                <NextBtn onClick={handleNextImage}>→</NextBtn>
            </div>
        )}
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
                <div>
                                                                        <p>Label: {selectedTask.labels}</p>
                                                                        
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
                                {imageUrls.map((url, index) => (
                                                            <div key={index}>
                                                                <img style={{display: 'flex', width: '200px', height: 'auto'}} src={url} alt={`${index}`} />                                                                        
                                                        </div>
                                                        ))}
                                                        <div style={{ display: 'flex',   flexDirection: 'column', marginTop: '10px' }}>
                                                        <SolveButton type="submit">💾 Complete</SolveButton>
                                                        <SolveButton onClick={handleCloseModal}>Close the window</SolveButton>
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