import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaUser, FaUserShield } from 'react-icons/fa';
import Layout from '../components/Layout';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="card">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome, {user?.username}! 👋
          </h1>
          <p className="text-gray-600 mb-6">
            This is your home page. You're logged in as a <strong>{user?.role}</strong>.
          </p>

          <div className="flex gap-4">
            <Link to="/profile" className="btn-primary inline-flex items-center gap-2">
              <FaUser />
              View Profile
            </Link>

            {user?.role === 'admin' && (
              <Link to="/admin/dashboard" className="btn-secondary inline-flex items-center gap-2">
                <FaUserShield />
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;