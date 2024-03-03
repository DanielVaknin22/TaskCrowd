import React, { useState } from 'react';

const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    taskType: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/user/create-tasks', formData);
      console.log(response.data); // Assuming the server responds with the created task data
      alert('Task created successfully');
      // Optionally, you can redirect the user to another page after successful task creation
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
            name="taskType"
            value={formData.taskType}
            onChange={handleChange}
            required
          >
            <option value="">Select Task Type</option>
            <option value="type1">Image classification</option>
            <option value="type2">Text cataloging</option>
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
