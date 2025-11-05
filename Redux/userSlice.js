import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    emailRedux: '',
    profileImageRedux: '',
    nameRedux: '',
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.emailRedux = action.payload.emailRedux;
            state.profileImageRedux = action.payload.profileImageRedux;
            state.nameRedux = action.payload.nameRedux;
        },
        clearUser: (state) => {
            state.emailRedux = '';
            state.profileImageRedux = '';
            state.nameRedux = '';
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;


