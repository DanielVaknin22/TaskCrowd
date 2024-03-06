import React, { useState } from 'react';

const ImageClassificationForm = ({ onSubmit }) => {
  const [userID, setUserID] = useState('');
  const [imagePaths, setImagePaths] = useState([]);
  const [labels, setLabels] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      userID,
      imagePaths,
      labels,
    };
    onSubmit(taskData);
  };

  const handleAddImage = () => {
    const newImagePaths = [...imagePaths];
    const newLabels = [...labels];
    newImagePaths.push('');
    newLabels.push('');
    setImagePaths(newImagePaths);
    setLabels(newLabels);
  };

  const handleChange = (index, type, value) => {
    if (type === 'image') {
      const newImagePaths = [...imagePaths];
      newImagePaths[index] = value;
      setImagePaths(newImagePaths);
    } else if (type === 'label') {
      const newLabels = [...labels];
      newLabels[index] = value;
      setLabels(newLabels);
    }
  };

  return (
    <div>
      <h2>Image Classification Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userID">User ID:</label>
          <input
            type="text"
            id="userID"
            value={userID}
            onChange={(e) => setUserID(e.target.value)}
            required
          />
        </div>
        {imagePaths.map((imagePath, index) => (
          <div key={index}>
            <label htmlFor={`imagePath-${index}`}>Image Path:</label>
            <input
              type="text"
              id={`imagePath-${index}`}
              value={imagePath}
              onChange={(e) => handleChange(index, 'image', e.target.value)}
              required
            />
            <label htmlFor={`label-${index}`}>Label:</label>
            <input
              type="text"
              id={`label-${index}`}
              value={labels[index]}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddImage}>Add Image</button>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default ImageClassificationForm;