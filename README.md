# User Management Application

A full-stack web application for user and admin management with authentication, JWT tokens, and role-based access control.

## Features

### User Features
- ✅ User Registration
- ✅ User Login
- ✅ View Profile
- ✅ Edit Profile (username, email)
- ✅ Change Password
- ✅ Upload Profile Image
- ✅ Logout

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ View All Users
- ✅ Create New Users
- ✅ Edit User Details
- ✅ Delete Users
- ✅ Search Users by Username/Email
- ✅ Pagination
- ✅ Role Management (User/Admin)

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Icons** - Icon library
- **React Toastify** - Notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with following variables
PORT=3000
MONGO_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d

# Start the server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will run on `http://localhost:5173`
Backend will run on `http://localhost:3000`

## Project Structure

```
user-management-app/
├── backend/
│   ├── config/
│   │   ├── db.js          (MongoDB connection)
│   │   └── multer.js      (File upload config)
│   ├── models/
│   │   └── User.js        (User schema)
│   ├── controllers/
│   │   ├── authController.js   (Register, Login)
│   │   ├── userController.js   (Profile, Update)
│   │   └── adminController.js  (User CRUD)
│   ├── middleware/
│   │   └── authMiddleware.js   (JWT verification)
│   ├── routes/
│   │   ├── authRoutes.js       (Auth endpoints)
│   │   ├── userRoutes.js       (User endpoints)
│   │   └── adminRoutes.js      (Admin endpoints)
│   ├── uploads/            (Uploaded files)
│   ├── server.js           (Entry point)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── admin/
│   │   │       ├── CreateUserModal.jsx
│   │   │       ├── EditUserModal.jsx
│   │   │       └── DeleteConfirmModal.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── admin/
│   │   │       └── AdminDashboard.jsx
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   └── slices/
│   │   │       ├── authSlice.js
│   │   │       ├── userSlice.js
│   │   │       └── adminSlice.js
│   │   ├── api/
│   │   │   └── axios.js         (API configuration)
│   │   ├── App.jsx              (Main component)
│   │   ├── main.jsx             (Entry point)
│   │   └── index.css            (Tailwind CSS)
│   ├── vite.config.js
│   └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### User
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/profile/image` - Upload profile image

### Admin
- `GET /api/admin/users` - Get all users (paginated & searchable)
- `GET /api/admin/users/:id` - Get single user
- `POST /api/admin/users` - Create new user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Frontend Routes

### Public
- `/login` - Login Page
- `/register` - Registration Page

### User (Protected)
- `/` - Home Page
- `/profile` - User Profile (View & Edit)

### Admin (Protected)
- `/admin/dashboard` - Admin Dashboard & User Management

## Usage

### For Users
1. **Register**: Create a new account with username, email, and password
2. **Login**: Login with email and password
3. **View Profile**: Navigate to Profile page to see your information
4. **Edit Profile**: Update username, email, or password
5. **Upload Image**: Click camera icon to upload profile picture
6. **Logout**: Click logout button in navbar

### For Admins
1. **Login**: Login with admin credentials
2. **Dashboard**: View statistics on admin dashboard
3. **Manage Users**: 
   - View all users with pagination
   - Search users by username or email
   - Create new users
   - Edit user details or role
   - Delete users

## Validation Rules

### Username
- Minimum 3 characters
- Maximum 20 characters
- Only letters, numbers, underscores, hyphens

### Email
- Valid email format

### Password
- Minimum 6 characters
- Maximum 50 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number

### Profile Image
- Maximum size: 5MB
- Formats: JPEG, JPG, PNG, GIF

## Authentication Flow

1. User registers with credentials
2. Password is hashed using bcryptjs
3. JWT token is generated on login
4. Token is stored in localStorage
5. Token is sent with every request in Authorization header
6. Backend verifies token with middleware
7. Expired tokens trigger automatic logout

## Role-Based Access Control

- **User Role**: Access profile, home, user pages
- **Admin Role**: Access admin dashboard, user management

## Security Features

- ✅ Password hashing (bcryptjs)
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Role-based access control
- ✅ CORS enabled
- ✅ Input validation
- ✅ File upload validation

## Environment Variables

### Backend (.env)
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### Frontend
Update `src/api/axios.js` with backend URL:
```javascript
const baseURL = 'http://localhost:3000/api';
```

## Running the Application

### Start Both Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Visit `http://localhost:5173` to access the application.

## Default Test Account

After registration, you can test with:
- **Email**: test@example.com
- **Password**: Test123

## Troubleshooting

### CORS Error
- Ensure backend has CORS enabled
- Check frontend API URL matches backend port

### MongoDB Connection Error
- Verify MongoDB is running
- Check MONGO_URI in .env
- For MongoDB Atlas, ensure IP whitelist includes your machine

### Images Not Uploading
- Check `uploads/profiles/` folder exists
- Verify file size is less than 5MB
- Ensure file is an image

### Login Redirect Issues
- Clear localStorage: `localStorage.clear()`
- Refresh page
- Check browser console for errors

---