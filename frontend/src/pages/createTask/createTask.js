import React, { useState } from 'react';
import axios from 'axios';
import { HomeWrapper, Fields, Btn, TextInput, TaskType, FormContainer, PlusImg, TextArea } from './createTask.style';
import { useNavigate } from 'react-router-dom';

const taskTypeDescriptions = {
  'Image classification': 'In this task, the task solver classifies images into predefined categories.',
  'Text cataloging': 'In this task, the task solver classifies text by adding a label in an open field.',
  'Image cataloging': 'In this task, the task solver catalogs images by adding labels in an open field.',
  'Label classification': 'In this task, you upload a certain label and the task solver uploads images suitable for the label.',
};

const CreateTaskPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    type: '',
    numsolution: '',
    images: [],
    labels: [],
    text: '',
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

  const navigate = useNavigate();

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
        alert('Task created successfully');
        navigate('/home');
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
    <HomeWrapper>
      <h2>Create Task</h2>
      <FormContainer onSubmit={handleSubmit}>
        <Fields>
          <label htmlFor="subject">Subject your project: </label>
          <TextInput
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          />
        </Fields>
        <Fields>
          <label htmlFor="taskType">Task Type: </label>
          <TaskType
            id="taskType"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option style={{color: 'black'}} value="">Select Task Type</option>
            <option style={{color: 'black'}} value="Image classification">Image classification</option>
            <option style={{color: 'black'}} value="Text cataloging">Text cataloging</option>
            <option style={{color: 'black'}} value="Image cataloging">Image cataloging</option>
            <option style={{color: 'black'}} value="Label classification">Label classification</option>

          </TaskType>
        </Fields>
        {formData.type && (
          <Fields>
            <p>{taskTypeDescriptions[formData.type]}</p>
          </Fields>
        )}
        <Fields>
          <label htmlFor="numsolution">Amount of required solutions: </label>
          <TextInput
            type="number"
            id="numsolution"
            name="numsolution"
            value={formData.numsolution}
            onChange={handleChange}
            required
          />
        </Fields>
        {formData.type === 'Image classification' && (
          <Fields>
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
          </Fields>
        )}
        {formData.type === 'Text cataloging' && (
          <Fields>
          <label htmlFor="text">Text: </label>
          <TextArea
            id="text"
            name="text"
            value={formData.text}
            onChange={handleChange}
            required
          ></TextArea>
          </Fields>
        )}

{formData.type === 'Image cataloging' && (
          <Fields>
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
          </Fields>
        )}

{formData.type === 'Label classification' && (
         <Fields>
         <label htmlFor="label">Label: </label>
         <TextInput
           id="label"
           name="label"
           value={formData.label}
           onChange={(e) => handleLabelChange(0, e.target.value)}
           required
         ></TextInput>
         </Fields>
        )}
        <Btn type="submit" onClick={upload}>Continue</Btn>
      </FormContainer>
    </HomeWrapper>
  );
};

export default CreateTaskPage;
