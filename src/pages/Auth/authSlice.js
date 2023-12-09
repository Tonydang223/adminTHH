import { createSlice } from '@reduxjs/toolkit'
import { ApisAuth } from './auth.service'

const initialState = {
  user: null,
  token: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut: () => initialState,
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken:(state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      ApisAuth.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.user = payload.user;
        state.token = payload.access_token;
      }
    )
  },
})

// Action creators are generated for each case reducer function


const {reducer} = authSlice

export default reducer;

export const {logOut, setUser, setToken} = authSlice.actions