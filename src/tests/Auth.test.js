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
    return res(ctx.status(201), ctx.json({ id: 3, name: 'Sakamoto' }));
  }),
  rest.get('http://localhost:8000/users/', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'Murakami',
          email: 'maito@example.com',
          password: '1111',
        },
        { id: 2, name: 'Hirai', email: 'a@example.com', password: '1111' },
      ]),
    );
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
    const inputValueName = screen.getByPlaceholderText('user-name');
    await userEvent.type(inputValueName, 'Sakamoto');
    const inputValueEmail = screen.getByPlaceholderText('user-email');
    await userEvent.type(inputValueEmail, 'a@example.com');
    const inputValuePass = screen.getByPlaceholderText('user-password');
    await userEvent.type(inputValuePass, '1111');
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toBeCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
  it('1-3: Should not route to LoginPage when registeration is rejected', async () => {
    render(
      <Provider store={store}>
        <Register />
      </Provider>,
    );
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toHaveBeenCalledTimes(0);
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
  it('2-2: Should route to TopPage when login is successful', async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
    const inputValueEmail = screen.getByPlaceholderText('user-email');
    await userEvent.type(inputValueEmail, 'maito@example.com');
    const inputValuePass = screen.getByPlaceholderText('user-password');
    await userEvent.type(inputValuePass, '1111');
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toBeCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
  it('2-3: Should not route to TopPage when login is rejected', async () => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>,
    );
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });
});
