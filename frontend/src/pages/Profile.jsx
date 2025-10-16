import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile, uploadProfileImage, reset } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';
import Layout from '../components/Layout';
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaCamera,
  FaEdit,
  FaSpinner,
} from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.user
  );

  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
      setShowEditModal(false);
      // Refresh profile data
      dispatch(getProfile());
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingImage(true);
    try {
      await dispatch(uploadProfileImage(formData)).unwrap();
      toast.success('Profile image updated successfully!');
      dispatch(getProfile());
    } catch (error) {
      toast.error(error || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const onChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdateProfile = (e) => {
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

    const updateData = {
      username: formData.username,
      email: formData.email,
    };

    dispatch(updateProfile(updateData));
  };

  const displayUser = profile || user;
  const profileImageUrl = displayUser?.profileImage
    ? `http://localhost:3000${displayUser.profileImage}`
    : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-gray-400 text-5xl" />
                )}
              </div>

              {/* Camera Icon Overlay */}
              <button
                onClick={handleImageClick}
                disabled={uploadingImage}
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition disabled:opacity-50"
              >
                {uploadingImage ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaCamera />
                )}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {displayUser?.username}
              </h1>
              <p className="text-gray-600 mb-1">{displayUser?.email}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {displayUser?.role}
              </span>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setShowEditModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaUser className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="font-medium text-gray-800">{displayUser?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaEnvelope className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{displayUser?.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <FaCalendar className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-800">
                  {displayUser?.createdAt
                    ? new Date(displayUser.createdAt).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Profile;