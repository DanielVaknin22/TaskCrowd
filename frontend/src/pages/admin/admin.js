import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {HomeWrapper, UL, RemoveBtn} from './admin.style';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/user');
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

  const handleRemoveUser = async (userId) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        const response = await fetch(`http://localhost:3001/user/${userId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('User deleted successfully');
          setUsers(users.filter((user) => user._id !== userId));
        } else {
          throw new Error('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  return (
    <HomeWrapper>
      <h1>All Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <UL onClick={() => handleUserClick(user._id)}>
              {user.name} - {user.email}
              <RemoveBtn onClick={() => handleRemoveUser(user._id)}>Remove</RemoveBtn>
            </UL>
          </li>
        ))}
      </ul>
    </HomeWrapper>
  );
};

export default AdminPage;
