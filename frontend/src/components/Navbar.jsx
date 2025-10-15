import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { FaUser, FaSignOutAlt, FaHome, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <FaUser className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800">UserApp</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            {/* Home Link */}
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <FaHome />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {/* Profile Link */}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
            >
              <FaUser />
              <span className="hidden sm:inline">Profile</span>
            </Link>

            {/* Admin Dashboard Link (Only for Admins) */}
            {user?.role === 'admin' && (
              <Link
               to="/admin/dashboard"
               className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition"
               >
               <FaUserShield />
               <span className="hidden sm:inline">Admin</span>
               </Link>
            )}

            {/* User Info & Logout */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-300">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition"
              >
                <FaSignOutAlt />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;