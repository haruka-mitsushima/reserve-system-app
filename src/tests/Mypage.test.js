import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import MyPage from '../components/MyPage';
import { sessionStorageMock, getUserInfo } from './sessionStorage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

const handlers = [
  rest.get('http://localhost:8000/reservations', (req, res, ctx) => {
    const query = req.url.searchParams;
    const user = query.get('user.id');
    if (user === '1') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            id: 1,
            title: 'T社様訪問',
            item: { id: 1, name: 'トヨタ・アルファードHYBRID' },
            date: '2023-08-20',
            startTime: '9:00',
            endTime: '17:00',
            user: { id: 1, name: 'Murakami' },
          },
          {
            id: 2,
            title: '営業拡販',
            item: { id: 2, name: 'Surface - 02' },
            date: '2023-08-20',
            startTime: '9:00',
            endTime: '17:00',
            user: { id: 1, name: 'Murakami' },
          },
        ]),
      );
    }
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
beforeEach(() => {
  window.sessionStorage.setItem(
    'auth',
    JSON.stringify({ id: 1, name: 'Murakami' }),
  );
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('Auth Component Test Cases', () => {
  it('1: should render all the elements correctly', async () => {
    render(<MyPage />);
    expect(screen.getByTestId('reserve-title')).toBeTruthy();
    expect(await screen.findByText('T社様訪問')).toBeInTheDocument();
    expect(screen.getByText('トヨタ・アルファードHYBRID')).toBeInTheDocument();
    expect(screen.getByText('Surface - 02')).toBeInTheDocument();
    expect(screen.getByText('営業拡販')).toBeInTheDocument();
    expect(screen.getByTestId('time-1')).toBeTruthy();
    expect(screen.getByTestId('time-2')).toBeTruthy();
    expect(screen.getByTestId('date-1')).toBeTruthy();
    expect(screen.getByTestId('date-2')).toBeTruthy();
    expect(screen.getByTestId('button-1')).toBeTruthy();
    expect(screen.getByTestId('button-2')).toBeTruthy();
  });

  it('2: should route to EditPage when click edit button', async () => {
    render(<MyPage />);
    expect(await screen.findByTestId('button-1')).toBeTruthy();
    await userEvent.click(screen.getByTestId('button-1'));
    expect(mockNavigate).toBeCalledWith('/reserve/edit/1');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
  it('3: should get user info from session storage', () => {
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
    window.sessionStorage.setItem(
      'auth',
      JSON.stringify({ id: 1, name: 'Murakami' }),
    );
    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'Murakami' });
    expect(getItemSpy).toBeCalledWith('auth');
  });
});
