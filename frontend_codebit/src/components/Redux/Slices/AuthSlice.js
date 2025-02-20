// /* eslint-disable no-unused-vars */
// import {createSlice} from '@reduxjs/toolkit'

// const initialState = {
//     currentUser: JSON.parse(localStorage.getItem('user')) || null,
//     error: null,
//     loading: null
// };

// const userSlice =createSlice({
//     name:'user',
//     initialState,
//     reducers:{
//         signInStart:(state)=>{
//             state.loading=true;
//         },
//         signInSuccess:(state,action)=>{
//             state.currentUser=action.payload;
//             state.loading=false;
//             state.error=null;
//         },
//         signInFailure:(state,action)=>{
//             state.currentUser=action.payload;
//             state.loading=false;
//         },
//         updateUserStart:(state)=>{
//             state.loading=true;
//         },
//         updateUserSuccess:(state,action)=>{
//             state.currentUser=action.payload;
//             state.loading=false;
//             state.error=null;
//         },
//         updateUserFailure:(state,action)=>{
//             state.error=action.payload;
//             state.loading=false;
//         },
//         deleteUserStart:(state)=>{
//             state.loading=true;
//         },
//         deleteUserSuccess:(state)=>{
//             state.currentUser=null;
//             state.loading=false;
//             state.error=null;
//         },
//         deleteUserFailure:(state,action)=>{
//             state.error=action.payload;
//             state.loading=false;
//         },
//         signoutUserStart:(state)=>{
//             state.loading=true;
//         },
//         signoutUserSuccess:(state)=>{
//             state.currentUser=null;
//             state.loading=false;
//             state.error=null;
//         },
//         signoutUserFailure:(state,action)=>{
//             state.error=action.payload;
//             state.loading=false;
//         }
//     }
// })

// export const { signInStart,signInSuccess,signInFailure,updateUserStart,updateUserSuccess,updateUserFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signoutUserStart,signoutUserSuccess,signoutUserFailure } = userSlice.actions;

// export default userSlice.reducer;
/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,  // Load from localStorage
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));  // Save to localStorage
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('currentUser');  // Remove from localStorage
    },
  },
});

export const { signInStart, signInSuccess, signInFailure, signoutUserSuccess } = userSlice.actions;
export default userSlice.reducer;
