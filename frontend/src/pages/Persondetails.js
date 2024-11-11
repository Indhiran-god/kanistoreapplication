import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const PersonDetails = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ address: {} });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        profilePic: user.profilePic,
        address: user.address || {},
      });
    }
  }, [user]);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(SummaryApi.update_user.url, {
        method: SummaryApi.update_user.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser),
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(data.updatedUser));
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Error updating user details. Please try again.');
      console.error('Update error:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="person-details">
      <div className="header">
        <h2 className="font-bold text-lg">User Details</h2>
      </div>
      <img src={user.profilePic} alt={user.name || 'User'} className="w-24 h-24 rounded-full mb-4" />
      <div>
        <strong>Name:</strong> {isEditing ? (
          <input type="text" name="name" value={editedUser.name} onChange={handleChange} className="border border-gray-300 p-2 rounded" />
        ) : (
          user.name
        )}
      </div>
      <div>
        <strong>Email:</strong> {user.email}
      </div>
      <div>
        <strong>Phone Number:</strong> {user.phoneNo}
      </div>
      <div>
        <strong>Address:</strong>
        {isEditing ? (
          <>
            <input type="text" name="street" placeholder="Street" value={editedUser.address.street || ''} onChange={handleAddressChange} className="border border-gray-300 p-2 rounded w-full mb-2" />
            <input type="text" name="city" placeholder="City" value={editedUser.address.city || ''} onChange={handleAddressChange} className="border border-gray-300 p-2 rounded w-full mb-2" />
            <input type="text" name="state" placeholder="State" value={editedUser.address.state || ''} onChange={handleAddressChange} className="border border-gray-300 p-2 rounded w-full mb-2" />
            <input type="text" name="postalCode" placeholder="Postal Code" value={editedUser.address.postalCode || ''} onChange={handleAddressChange} className="border border-gray-300 p-2 rounded w-full mb-2" />
            <input type="text" name="country" placeholder="Country" value={editedUser.address.country || ''} onChange={handleAddressChange} className="border border-gray-300 p-2 rounded w-full mb-2" />
          </>
        ) : (
          <div>
            {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.postalCode}, {user.address?.country}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4">
        {isEditing ? (
          <button onClick={handleProfileUpdate} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        ) : (
          <button onClick={handleEditToggle} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
        )}
      </div>
    </div>
  );
};

export default PersonDetails;
