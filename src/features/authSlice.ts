import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const apiUrl = "http://localhost:8000/"

export const fetchAsyncLogin = createAsyncThunk("login/post", async(auth: {email: string, password: string}) => {
    const res = await axios.get(`${apiUrl}user?email=${auth.email}&password=${auth.password}` ,{

        headers: {
            "Content-Type": "application/json"
        },
    });
    return res.data
});

export const fetchAsyncRegister = createAsyncThunk(
    "register/post",
    async (auth: {name: string, email: string, password: string, reservedItem: Array<any>}) => {
        const res = await axios.post(`${apiUrl}users/`, auth, {
            headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    }
  );

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        profile: {
            id: 0, username:""
        }
    },
    reducers: {},
    extraReducers:(builder) => {
        builder.addCase(fetchAsyncLogin.fulfilled, (state,action) => {
            sessionStorage.setItem('auth', action.payload.name)
        })
    }
})

export const selectProfile = (state: any) => state.auth.profile
export default authSlice.reducer
