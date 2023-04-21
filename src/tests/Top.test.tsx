import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { cleanup, render, screen } from '@testing-library/react';
import Top from '../components/Top/Top';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const sessionStorageMock = (() => {
  let mockStorage: { [key: string]: string } = {};
  return {
    getItem(key: string) {
      return mockStorage[key] || null;
    },
    setItem(key: string, value: string) {
      mockStorage[key] = value;
    },
    clear() {
      mockStorage = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

const handlers = [
  rest.get('http://localhost:8000/Items', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          name: '大会議室',
          category: '会議室',
          id: 1,
        },
        {
          name: 'MacBook Air - 01',
          category: 'PC',
          id: 2,
        },
        {
          name: 'Surface - 01',
          category: 'PC',
          id: 3,
        },
        {
          name: 'ハイエース',
          category: '社用車',
          id: 4,
        },
      ]),
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});

beforeEach(() => {
  window.sessionStorage.setItem(
    'auth',
    JSON.stringify({ id: 1, name: 'test' }),
  );
});

afterEach(() => {
  server.resetHandlers();
  cleanup();
});

afterAll(() => {
  server.close();
});

describe('Top', () => {
  it('1 Should render components correctly in Top component', async () => {
    render(<Top />);
    expect(screen.getByText('会議室')).toBeInTheDocument();
    expect(screen.getByText('社用車')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
    expect(await screen.findAllByTestId('card')).toBeTruthy();
    expect(screen.getAllByTestId('card')[0]).toBeTruthy();
    expect(screen.getAllByTestId('card')[1]).toBeTruthy();
    expect(screen.getAllByTestId('card')[2]).toBeTruthy();
    expect(screen.getAllByTestId('card')[3]).toBeTruthy();
    expect(screen.getByAltText('大会議室')).toBeTruthy();
    expect(screen.getByAltText('MacBook Air - 01')).toBeTruthy();
    expect(screen.getByAltText('Surface - 01')).toBeTruthy();
    expect(screen.getByAltText('ハイエース')).toBeTruthy();
    expect(screen.getByText('大会議室')).toBeTruthy();
    expect(screen.getByText('MacBook Air - 01')).toBeTruthy();
    expect(screen.getByText('Surface - 01')).toBeTruthy();
    expect(screen.getByText('ハイエース')).toBeTruthy();
  });

  it('2 Should navigate when click card', async () => {
    render(<Top />);
    jest.spyOn(window.sessionStorage, 'getItem');
    expect(window.sessionStorage.getItem('auth')).toEqual(
      JSON.stringify({ id: 1, name: 'test' }),
    );
    // console.log(window.sessionStorage.getItem.mock.calls); // 関数が呼び出された回数と引数を表示
    // console.log(window.sessionStorage.getItem.mock.results); // 関数の返り値を表示
    expect(await screen.findAllByTestId('card')).toBeTruthy();
    await userEvent.click(screen.getAllByTestId('card')[0]);
    expect(mockNavigate).toBeCalledWith('/item/1');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
