import { configureStore } from '@reduxjs/toolkit';
import idsReducer from './idsSlice';
import selectedItemsReducer from './selectedItemsSlice';

const store = configureStore({
    reducer: {
        ids: idsReducer,
        selectedItems: selectedItemsReducer
    }
});

export default store;