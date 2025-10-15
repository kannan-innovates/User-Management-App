import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getUserById,
  updateUser,
  reset,
//   clearSelectedUser,
} from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
import { FaSpinner, FaTimes } from 'react-icons/fa';

const EditUserModal = ({ userId, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { selectedUser, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.admin
  );

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: '',
  });

  // Fetch user data on mount
  useEffect(() => {
    dispatch(getUserById(userId));
  }, [dispatch, userId]);

  // Populate form when user data is loaded
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username || '',
        email: selectedUser.email || '',
        role: selectedUser.role || 'user',
        password: '',
      });
    }
  }, [selectedUser]);

  // Handle success/error
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('User updated successfully!');
      onSuccess();
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, onSuccess]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

     // Username validation
  if (!formData.username) {
    toast.error('Username is required');
    return;
  }
  if (formData.username.length < 3) {
    toast.error('Username must be at least 3 characters');
    return;
  }
  if (formData.username.length > 20) {
    toast.error('Username must not exceed 20 characters');
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
    toast.error('Username can only contain letters, numbers, underscores, and hyphens');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    toast.error('Email is required');
    return;
  }
  if (!emailRegex.test(formData.email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  // Role validation
  if (!formData.role) {
    toast.error('Please select a role');
    return;
  }

  // Password validation (only if password is being changed)
  if (formData.password) {
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (formData.password.length > 50) {
      toast.error('Password must not exceed 50 characters');
      return;
    }
    if (!/(?=.*[a-z])/.test(formData.password)) {
      toast.error('Password must contain at least one lowercase letter');
      return;
    }
    if (!/(?=.*[A-Z])/.test(formData.password)) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }
    if (!/(?=.*\d)/.test(formData.password)) {
      toast.error('Password must contain at least one number');
      return;
    }
  }

  // Only include password if it's being changed
  const updateData = {
    username: formData.username,
    email: formData.email,
    role: formData.role,
  };

  if (formData.password) {
    updateData.password = formData.password;
  }

  dispatch(updateUser({ userId, userData: updateData }));
  };

  if (!selectedUser) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="card">
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-blue-600 text-4xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition text-xl"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="Enter username"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="Enter email"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={onChange}
              className="input-field cursor-pointer"
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password (Optional) */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Change Password (Optional)
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={onChange}
                placeholder="Leave empty to keep current password"
                className="input-field"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to keep the current password
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Updating...
                </>
              ) : (
                'Update User'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;