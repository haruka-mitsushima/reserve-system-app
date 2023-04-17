import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import counterReducer from '../features/counter/counterSlice';
import addReserveReducer from '../features/addReserveSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    addReserve: addReserveReducer,
    auth: authReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
