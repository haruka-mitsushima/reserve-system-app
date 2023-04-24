import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import Register from '../components/Register';
import Login from '../components/Login';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const handlers = [
  rest.post('http://localhost:8000/users/', (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.get('http://localhost:8000/users/1', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ id: 1, name: 'Momo' }));
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('Auth Component Test Cases', () => {
  let store;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
  });
  it('1-1: should render all the elements correctly in Register Component', async () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>,
    );
    expect(screen.getByTestId('input-name')).toBeTruthy();
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('input-password')).toBeTruthy();
    expect(screen.getByTestId('button')).toBeTruthy();
  });
  it('1-2: Should route to LoginPage when registeration is successful', async () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>,
    );
    await userEvent.click(screen.getByTestId('button'));
    // await userEvent.click(screen.getByText('ユーザー登録'));
    expect(mockNavigate).toBeCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
  it('2-1 should render all the elements correctly in Login Component', async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
    expect(screen.getByTestId('input-email')).toBeTruthy();
    expect(screen.getByTestId('input-password')).toBeTruthy();
    expect(screen.getByTestId('button')).toBeTruthy();
  });
});
