import { createSlice } from '@reduxjs/toolkit';

const idsSlice = createSlice({
    name: 'ids',
    initialState: [],
    reducers: {
        setIds: (state, action) => {
            return action.payload;
        }
    }
});

export const { setIds } = idsSlice.actions;
export default idsSlice.reducer;