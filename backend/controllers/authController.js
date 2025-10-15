import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


export const register = async (req, res) => {
     try {
          const { username, email, password } = req.body;

         
          if (!username || !email || !password) {
               return res.status(400).json({
                    success: false,
                    message: 'Please provide all fields'
               });
          }

          
          const existingUser = await User.findOne({ email });
          if (existingUser) {
               return res.status(400).json({
                    success: false,
                    message: 'User already exists'
               });
          }

         
          const user = await User.create({ username, email, password });

          
          const token = generateToken(user._id, user.role);

        
          res.status(201).json({
               success: true,
               message: 'User registered successfully',
               token,
               user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage
               }
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message  
          });
     }
}


export const login = async (req, res) => {
     try {
          const { email, password } = req.body;

          
          if (!email || !password) {
               return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
               });
          }

          
          const user = await User.findOne({ email }).select('+password');  
          
          if (!user) {
               return res.status(400).json({  
                    success: false,
                    message: 'Invalid credentials'
               });
          }

          
          const isMatch = await user.comparePassword(password);

          if (!isMatch) {
               return res.status(400).json({
                    success: false,
                    message: 'Invalid credentials'
               });
          }

          
          const token = generateToken(user._id, user.role);

         
          res.status(200).json({
               success: true,
               message: 'Login successful',
               token,
               user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    profileImage: user.profileImage
               }
          });

     } catch (error) {
          res.status(500).json({
               success: false,
               message: error.message
          });
     }
}