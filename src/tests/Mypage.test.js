import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import MyPage from '../components/MyPage';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const handlers = [
  rest.get('http://localhost:8000/reservations', (req, res, ctx) => {
    const query = req.url.searchParams;
    const user = query.get('user');
    console.log(user);
    if (user.id === 1) {
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
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('Auth Component Test Cases', () => {
  it('1-1: should render all the elements correctly', async () => {
    render(<MyPage />);
    expect(screen.getByTestId('reserve-title')).toBeTruthy();
    expect(screen.getByTestId('list-1')).toBeTruthy();
    expect(screen.getByTestId('list-2')).toBeTruthy();
  });
});
