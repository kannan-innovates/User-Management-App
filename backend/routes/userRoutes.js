import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadProfileImage 
} from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import upload from '../config/multer.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/profile', getProfile);

router.put('/profile', updateProfile);

router.post('/profile/image', upload.single('profileImage'), uploadProfileImage);

export default router;
