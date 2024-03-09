import React, { useState, useEffect } from 'react';

const ImageClassificationForm = ({ onSubmit }) => {
  const [userID, setUserID] = useState('');
  const [images, setImages] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const storedUserID = localStorage.getItem('userID');
    if (storedUserID) {
      setUserID(storedUserID);
    }
  }, []);

  const handleImageChange = (e, index) => {
    const files = e.target.files;
    const newImages = Array.from(files);
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (index) => {
    const filteredImages = images.filter((_, i) => i !== index);
    setImages(filteredImages);
  };

  const handleLabelChange = (index, value) => {
    const newLabels = [...labels];
    newLabels[index] = value;
    setLabels(newLabels);
  };

  const handleAddLabel = () => {
    setLabels([...labels, '']);
  };

  // const handleAddImage = () => {
  //   setImages([...images, null]);
  //   setLabels([...labels, '']);
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image${index}`, image);
    });
    labels.forEach((label, index) => {
      formData.append(`label${index}`, label);
    });
    formData.append('userID', userID);
    onSubmit(formData);
  };

  // const handleAddImage = () => {
  //   const newImagePaths = [...imagePaths];
  //   const newLabels = [...labels];
  //   newImagePaths.push('');
  //   newLabels.push('');
  //   setImagePaths(newImagePaths);
  //   setLabels(newLabels);
  // };

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
            <img src={URL.createObjectURL(image)} alt={`Image ${index}`} />
            <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
            {/* <label htmlFor={`image-${index}`}>Image {index + 1}:</label>
            <input
              type="file"
              id={`image-${index}`}
              onChange={(e) => handleImageChange(e, index)}
              required
            /> */}
            <label htmlFor={`label-${index}`}>Label:</label>
            <input
              type="text"
              id={`label-${index}`}
              value={labels[index]}
              onChange={(e) => handleLabelChange(index, e.target.value)}
              required
            />
          </div>
        ))}
        {/* <button type="button" onClick={handleAddImage}>Add Image</button> */}
        <button type="button" onClick={handleAddLabel}>Add Label</button>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default ImageClassificationForm;