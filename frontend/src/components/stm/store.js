// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import idsReducer from './idsSlice';
import productsNAReducer from './productsNASlice';

const store = configureStore({
  reducer: {
    ids: idsReducer,
    productsNA: productsNAReducer
  }
});

export default store;