import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice'; // Adjust the import according to your structure
import SummaryApi from '../common'; // Ensure you have the API methods for fetching/updating user details
import { toast } from 'react-toastify';

const PersonDetails = () => {
  const user = useSelector((state) => state.user.user); // Get user details from Redux store
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    address: {}, // Initialize address as an empty object
  });

  useEffect(() => {
    if (user) {
      setEditedUser({
        name: user.name,
        profilePic: user.profilePic,
        address: user.address || {}, // Use user address if available
      });
    }
  }, [user]);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value }, // Update address fields
    }));
  };

  const handleProfileUpdate = async () => {
    try {
      const response = await fetch(SummaryApi.update_user.url, {
        method: SummaryApi.update_user.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedUser), // Send updated user data, including address
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        dispatch(setUserDetails(data.updatedUser)); // Assuming the API returns the updated user
        setIsEditing(false); // Exit editing mode
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (error) {
      toast.error('Error updating user details. Please try again.');
      console.error('Update error:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditedUser({
      name: user.name,
      profilePic: user.profilePic,
      address: user.address || {}, // Reset to original user details
    });
    setIsEditing(false);
  };

  if (!user) {
    return <div>Loading...</div>; // Show loading state if user data is not yet available
  }

  return (
    <div className="bg-white py-2 px-4 min-h-screen flex flex-col">
      {/* Header section with Save and Cancel buttons */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">User details</h2>

        {/* Save and Cancel buttons */}
        {isEditing && (
          <div className="flex space-x-4">
            <button
              onClick={handleProfileUpdate}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* User profile picture */}
      <img
        src={user.profilePic}
        alt={user.name || 'User'}
        className="w-24 h-24 rounded-full mb-4 mx-auto"
      />

      <div className="mb-4">
        <strong>Name:</strong>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={handleChange}
            className="border border-gray-300 p-2 rounded w-full mb-2"
          />
        ) : (
          user.name
        )}
      </div>

      <div className="mb-4">
        <strong>Email:</strong> {user.email}
      </div>

      <div className="mb-4">
        <strong>Phone Number:</strong> {user.phoneNo}
      </div>

      <div className="mb-4">
        <strong>Address:</strong>
        {isEditing ? (
          <>
            <input
              type="text"
              name="street"
              placeholder="Street"
              value={editedUser.address.street || ''}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={editedUser.address.city || ''}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="state"
              placeholder="State"
              value={editedUser.address.state || ''}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code"
              value={editedUser.address.postalCode || ''}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={editedUser.address.country || ''}
              onChange={handleAddressChange}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
          </>
        ) : (
          <div>
            {user.address?.street}, {user.address?.city}, {user.address?.state}, {user.address?.postalCode}, {user.address?.country}
          </div>
        )}
      </div>

      {/* Scrollable container for content */}
      <div className="flex-grow overflow-auto">
        {/* Other content or additional sections */}
      </div>

      {/* Footer section */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <p>&copy; 2024 Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default PersonDetails;
