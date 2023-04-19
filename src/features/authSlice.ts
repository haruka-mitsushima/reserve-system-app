import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Reservation } from '../types/Reservation';

const apiUrl = 'http://localhost:8000/';

export const fetchAsyncLogin = createAsyncThunk(
  'login/post',
  async (auth: { email: string; password: string }) => {
    const res = await axios.get(
      `${apiUrl}users?email=${auth.email}&password=${auth.password}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return res.data;
  },
);

export const fetchAsyncRegister = createAsyncThunk(
  'register/post',
  async (auth: {
    name: string;
    email: string;
    password: string;
    reservedItem: Array<Reservation>;
  }) => {
    const res = await axios.post(`${apiUrl}users/`, auth, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    profile: {
      id: 0,
      username: '',
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      if (!action.payload[0]) {
        alert('ログインに失敗しました');
      } else {
        const obj = {
          id: action.payload[0].id,
          name: action.payload[0].name,
        };
        //オブジェクトをJSON文字列に変換
        const jsonObj = JSON.stringify(obj);
        sessionStorage.setItem('auth', jsonObj);
      }
    });
  },
});

export const selectProfile = (state: any) => state.auth.profile;
export default authSlice.reducer;
