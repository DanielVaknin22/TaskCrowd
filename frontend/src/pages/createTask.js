import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    type: '',
    numsolution: '',
  });

  const history = useNavigate();

  const getUserID = () => {
    return localStorage.getItem('userID');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = getUserID();
    try {
      const response = await fetch('http://localhost:3000/task/create-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          userID: userID
        })
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert('Task created successfully');

        if (formData.type === 'Image classification') {
          history('/give-tasks/image-classification');
        } else if (formData.type === 'Text cataloging') {
          history('/text-cataloging');
        } else {
          alert('Unknown task type');
        }
      } else {
        console.error('Failed to create task:', response.statusText);
        alert('Failed to create task');
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task');
    }
  };

  return (
    <div>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Subject your project: </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="taskType">Task Type: </label>
          <select
            id="taskType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="">Select Task Type</option>
            <option value="Image classification">Image classification</option>
            <option value="Text cataloging">Text cataloging</option>
          </select>
        </div>
        <div>
          <label htmlFor="numsolution">number of solution: </label>
          <input
            type="number"
            id="numsolution"
            name="numsolution"
            value={formData.numsolution}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Continue</button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
