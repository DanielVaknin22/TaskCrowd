import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    type: '',
    numsolution: '',
    images: [],
    labels: [],
  });
  const upload = () => {
    const formDataUpload = new FormData();
    formData.images.forEach((image, index) => {
      formDataUpload.append('images', image);
    });
    
    axios.post('http://localhost:3000/upload-image', formDataUpload )
    .then( res => {})
    .catch(er => console.log(er))
  }

  // const history = useNavigate();

  const getUserID = () => {
    return localStorage.getItem('userID');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const convertToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof File)) {
        reject(new Error('Parameter is not of type File'));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('images:', files);
    setFormData({
      ...formData,
      images: files,
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = getUserID();
    const base64Images = await Promise.all(formData.images.map(file => convertToBase64(file)));
    const formDataWithUserID = {
      ...formData,
      userID: userID,
      images: base64Images
    };
    console.log(formDataWithUserID);
    try {
      const response = await fetch('http://localhost:3000/task/create-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataWithUserID),
      });
      if (response.ok) {
        const responseData = await response.json();
        const { numsolution, subject } = responseData;
        if (numsolution !== undefined) {
          localStorage.setItem('numsolution', numsolution);
        }
        if (subject !== undefined) {
          localStorage.setItem('subject', subject);
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
        {formData.type === 'Image classification' && (
          <div>
            <label htmlFor="images">Upload Images: </label>
            <input
              type="file"
              id="images"
              name="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              required
            />
            <button type="button" onClick={handleAddLabel}>Add Label</button>
            {formData.labels.map((label, index) => (
              <div key={index}>
                <label htmlFor={`label-${index}`}>Label {index + 1}:</label>
                <input
                  type="text"
                  id={`label-${index}`}
                  value={label}
                  onChange={(e) => handleLabelChange(index, e.target.value)}
                  required
                />
              </div>
            ))}
          </div>
        )}
        {/* {formData.images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index}`} />
        ))} */}
        <button type="submit" onClick={upload}>Continue</button>
      </form>
    </div>
  );
};

export default CreateTaskPage;
