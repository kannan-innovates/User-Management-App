import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

const initialState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Get user profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get('/user/profile');
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.put('/user/profile', userData);
      
      // Update user in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = { ...storedUser, ...response.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data.user;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Upload profile image
export const uploadProfileImage = createAsyncThunk(
  'user/uploadProfileImage',
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post('/user/profile/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Update user in localStorage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      storedUser.profileImage = response.data.profileImage;
      localStorage.setItem('user', JSON.stringify(storedUser));
      
      return response.data.profileImage;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        if (state.profile) {
          state.profile.profileImage = action.payload;
        }
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;