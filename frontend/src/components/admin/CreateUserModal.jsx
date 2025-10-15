
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, reset } from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
import { FaSpinner, FaTimes } from 'react-icons/fa';

const CreateUserModal = ({ onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });

  const { username, email, password, role } = formData;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success('User created successfully!');
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
  if (!username) {
    toast.error('Username is required');
    return;
  }
  if (username.length < 3) {
    toast.error('Username must be at least 3 characters');
    return;
  }
  if (username.length > 20) {
    toast.error('Username must not exceed 20 characters');
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    toast.error('Username can only contain letters, numbers, underscores, and hyphens');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    toast.error('Email is required');
    return;
  }
  if (!emailRegex.test(email)) {
    toast.error('Please enter a valid email address');
    return;
  }

  // Password validation
  if (!password) {
    toast.error('Password is required');
    return;
  }
  if (password.length < 6) {
    toast.error('Password must be at least 6 characters');
    return;
  }
  if (password.length > 50) {
    toast.error('Password must not exceed 50 characters');
    return;
  }
  if (!/(?=.*[a-z])/.test(password)) {
    toast.error('Password must contain at least one lowercase letter');
    return;
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    toast.error('Password must contain at least one uppercase letter');
    return;
  }
  if (!/(?=.*\d)/.test(password)) {
    toast.error('Password must contain at least one number');
    return;
  }

  // Role validation
  if (!role) {
    toast.error('Please select a role');
    return;
  }

    dispatch(createUser(formData));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="card max-w-md w-full">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
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
              value={username}
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
              value={email}
              onChange={onChange}
              placeholder="Enter email"
              className="input-field"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter password (min 6 characters)"
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
              value={role}
              onChange={onChange}
              className="input-field cursor-pointer"
              disabled={isLoading}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
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
                  Creating...
                </>
              ) : (
                'Create User'
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

export default CreateUserModal;