import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Choose what do you want</h2>
      <div>
        <Link to="/solve-tasks">
          <button>Solve Tasks</button>
        </Link>
        <Link to="/give-tasks">
          <button>Give Tasks</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
