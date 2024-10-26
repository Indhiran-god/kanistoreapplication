import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import SummaryApi from './common'; // Adjust the import as per your file structure

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await axios.get(SummaryApi.Category.url);
  return response.data; // Ensure this returns an array of categories
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.fulfilled, (state, action) => {
        return action.payload; // Set the categories to the state
      });
  },
});

export default categorySlice.reducer;
