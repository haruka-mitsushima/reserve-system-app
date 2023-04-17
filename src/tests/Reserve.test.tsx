import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reserve from '../components/Reserve/Reserve';
import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import addReserveReducer from '../features/addReserveSlice';
import { Provider } from 'react-redux';

describe('Reserve Component Test Case', () => {
  let store: Store<unknown, AnyAction>;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        addReserve: addReserveReducer,
      },
    });
  });
  it('should render all the elements correctlly', () => {
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    expect(screen.getByRole('heading')).toBeTruthy();
    expect(
      screen.getByPlaceholderText('用途を記入してください'),
    ).toBeInTheDocument();
    expect(screen.getByText('設備を選択してください')).toBeInTheDocument();
    expect(screen.getByText('日付を選択してください')).toBeInTheDocument();
    expect(screen.getByText('開始時刻を選択してください')).toBeInTheDocument();
    expect(screen.getByText('終了時刻を選択してください')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeTruthy();
    expect(screen.getByText('登録する')).toBeTruthy();
  });
});
