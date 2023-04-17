import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

type Items = {
  id: number;
  name: string;
  category: string;
};

type addItem = {
  title: string;
  item: { id: 0; name: string };
  startdate: string;
  endDate: string;
  user: { id: number; name: string };
};

const initialState = {
  addItem: {
    title: '',
    item: { id: 0, name: '' },
    date: '',
    startTime: '',
    endTime: '',
    user: { id: 0, name: '' },
  },
};

export const addReserveSlice = createSlice({
  name: 'addReserve',
  initialState,
  reducers: {
    add(state, action) {
      state.addItem = action.payload;
    },
  },
});

export const { add } = addReserveSlice.actions;

export const selectAdd = (state: { addReserve: { addItem: addItem } }) =>
  state.addReserve.addItem;

export default addReserveSlice.reducer;
