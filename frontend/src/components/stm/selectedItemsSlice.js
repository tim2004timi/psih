import { createSlice } from '@reduxjs/toolkit';

const selectedItemsSlice = createSlice({
    name: 'selectedItems',
    initialState: [],
    reducers: {
        setSelectedItems: (state, action) => {
            return action.payload;
        },
        addSelectedItem: (state, action) => {
            if (!state.includes(action.payload)) {
                state.push(action.payload);
            }
        },
        removeSelectedItem: (state, action) => {
            return state.filter(item => item !== action.payload);
        }
    }
});

export const { setSelectedItems, addSelectedItem, removeSelectedItem } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;