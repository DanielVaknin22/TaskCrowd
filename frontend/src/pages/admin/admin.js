import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {HomeWrapper, UL} from './admin.style';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/user');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  return (
    <HomeWrapper>
    <h1>All Users</h1>
      <ul>
        {users.map((user) => (
          <UL key={user._id} onClick={() => handleUserClick(user._id)}>
            {user.name} - {user.email}
          </UL>
        ))}
      </ul>
    </HomeWrapper>
  );
};

export default AdminPage;
