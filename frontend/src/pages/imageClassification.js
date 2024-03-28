import React, { useState } from 'react';

const ImageClassificationForm = ({ userID, subject, numsolution }) => {
  const [images, setImages] = useState([]);
  // const [labels, setLabels] = useState([]);

  const handleImageChange = async (e) => {
    const files = e.target.files;
    const imagePromises = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = readImage(file);
      imagePromises.push(promise);
    }
  
    const imageDataArray = await Promise.all(imagePromises);
    const newImages = imageDataArray.map(data => data.dataURL);
    setImages(newImages);
  };

  const readImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          file: file,
          dataURL: e.target.result
        });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    const filteredImages = images.filter((_, i) => i !== index);
    setImages(filteredImages);
  };

  // const getUserID = () => {
  //   return localStorage.getItem('userID');
  // };

  // const getSubject = () => {
  //   return localStorage.getItem('subject');
  // };

  // const getNumsolution = () => {
  //   return localStorage.getItem('numsolution');
  // };

  // const handleLabelChange = (index, value) => {
  //   const newLabels = [...labels];
  //   newLabels[index] = value;
  //   setLabels(newLabels);
  // };

  // const handleAddLabel = () => {
  //   setLabels([...labels, '']);
  // };

  // const handleAddImage = () => {
  //   setImages([...images, null]);
  //   setLabels([...labels, '']);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const userID = localStorage.getItem('userID');
    const numsolution = localStorage.getItem('numsolution');
    const subject = localStorage.getItem('subject');
    const type = 'Image classification';
    const formDataWithDetails = {
      ...formData,
      userID: userID,
      numsolution: numsolution,
      subject: subject,
      type: type
    };
    images.forEach((image) => {
      formData.append(`images[]`, image.file);
    });
    try {
      const response = await fetch('http://localhost:3000/task/create-image-classification-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataWithDetails)
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        alert('Image classification task created successfully');
      } else {
        console.error('Failed to create image classification task:', response.statusText);
        alert('Failed to create image classification task');
      }
    } catch (error) {
      console.error('Error creating image classification task:', error);
      alert('Failed to create image classification task');
    }
  };

  // const handleChange = (index, type, value) => {
  //   if (type === 'image') {
  //     const newImagePaths = [...imagePaths];
  //     newImagePaths[index] = value;
  //     setImagePaths(newImagePaths);
  //   } else if (type === 'label') {
  //     const newLabels = [...labels];
  //     newLabels[index] = value;
  //     setLabels(newLabels);
  //   }
  // };

  return (
    <div>
      <h2>Image Classification Task</h2>
      <form onSubmit={handleSubmit}>
      <label htmlFor="images">Upload Images:</label>
      <input
          type="file"
          id="images"
          name="images"
          onChange={handleImageChange}
          multiple
          required
        />
        {images.map((image, index) => (
          <div key={index}>
            <img width={100} height={100} src={image.dataURL} alt={`Image ${index}`} />
            <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
            {/* <label htmlFor={`image-${index}`}>Image {index + 1}:</label>
            <input
              type="file"
              id={`image-${index}`}
              onChange={(e) => handleImageChange(e, index)}
              required
            /> */}
            {/*<label htmlFor={`label-${index}`}>Label:</label>
            <input
              type="text"
              id={`label-${index}`}
              value={labels[index]}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              required
          />*/}
          </div>
        ))}
        {/* <button type="button" onClick={handleAddImage}>Add Image</button> */}
        {/* <button type="button" onClick={handleAddLabel}>Add Label</button> */}
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default ImageClassificationForm;