import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser, reset, clearSelectedUser } from '../../redux/slices/adminSlice';
import { toast } from 'react-toastify';
import Layout from '../../components/Layout';
import CreateUserModal from '../../components/admin/CreateUserModal';
import EditUserModal from '../../components/admin/EditUserModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaUsers,
  FaUserShield,
} from 'react-icons/fa';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, pagination, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.admin
  );
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  // Fetch users
  useEffect(() => {
    dispatch(getAllUsers({ page: currentPage, limit: 10, search: searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

  // Handle success/error messages
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
      dispatch(getAllUsers({ page: currentPage, limit: 10, search: searchTerm }));
    }

    dispatch(reset());
  }, [isError, isSuccess, message, dispatch, currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleEdit = (userId) => {
    setSelectedUserId(userId);
    setShowEditModal(true);
  };

  const handleDeleteClick = (userId, username) => {
    setSelectedUserId(userId);
    setSelectedUserName(username);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteUser(selectedUserId)).unwrap();
      setShowDeleteModal(false);
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error || 'Failed to delete user');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Calculate statistics
  const totalUsers = pagination.totalUsers;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const userCount = users.filter((u) => u.role === 'user').length;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.username}!</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Users</p>
                <h3 className="text-4xl font-bold">{totalUsers}</h3>
              </div>
              <div className="text-5xl opacity-20">
                <FaUsers />
              </div>
            </div>
          </div>

          {/* Admins Card */}
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Administrators</p>
                <h3 className="text-4xl font-bold">{adminCount}</h3>
              </div>
              <div className="text-5xl opacity-20">
                <FaUserShield />
              </div>
            </div>
          </div>

          {/* Regular Users Card */}
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Regular Users</p>
                <h3 className="text-4xl font-bold">{userCount}</h3>
              </div>
              <div className="text-5xl opacity-20">
                <FaUsers />
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="card">
          {/* Header with Create Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <p className="text-gray-600 text-sm mt-1">View, create, edit and delete users</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <FaPlus />
              Create User
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by username or email..."
                className="input-field pr-12"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Users Table */}
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-blue-600 text-4xl" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No users found</p>
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-700 mt-2"
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">User</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-4 px-4 font-semibold text-gray-700">Joined</th>
                      <th className="text-right py-4 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                              {u.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{u.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{u.email}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'admin'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(u._id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit user"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(u._id, u.username)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete user"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <p className="text-gray-600">
                  Showing {users.length} of {pagination.totalUsers} users
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <FaChevronLeft />
                    Previous
                  </button>

                  <span className="px-4 py-2 text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    Next
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            dispatch(getAllUsers({ page: currentPage, limit: 10, search: searchTerm }));
          }}
        />
      )}

      {showEditModal && (
        <EditUserModal
          userId={selectedUserId}
          onClose={() => {
            setShowEditModal(false);
            dispatch(clearSelectedUser());
          }}
          onSuccess={() => {
            setShowEditModal(false);
            dispatch(clearSelectedUser());
            dispatch(getAllUsers({ page: currentPage, limit: 10, search: searchTerm }));
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          userName={selectedUserName}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </Layout>
  );
};

export default AdminDashboard;