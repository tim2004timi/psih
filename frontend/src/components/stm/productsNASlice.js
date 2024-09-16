// store/productsNASlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productsNA: [],
};

export const productsNASlice = createSlice({
  name: 'productsNA',
  initialState,
  reducers: {
    setProductsNA: (state, action) => {
      state.productsNA = action.payload;
    },
  },
});

export const { setProductsNA } = productsNASlice.actions;

export default productsNASlice.reducer;