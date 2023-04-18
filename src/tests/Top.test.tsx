import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { cleanup, render, screen } from '@testing-library/react';
import Top from '../components/Top/Top';
import Items from '../components/Top/Items';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

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
          name: 'ハイエース',
          category: '社用車',
          id: 3,
        },
      ]),
    );
  }),
];

const category_PC = 'PC';
const pc = [
  {
    name: 'Surface - 01',
    category: 'PC',
    id: 1,
  },
  {
    name: 'ThinkPad - 01',
    category: 'PC',
    id: 2,
  },
  {
    name: 'ThinkPad - 02',
    category: 'PC',
    id: 3,
  },
];
const category_room = '会議室';
const room = [
  {
    name: '大会議室',
    category: '会議室',
    id: 4,
  },
  {
    name: '中会議室',
    category: '会議室',
    id: 5,
  },
];
const category_car = '社用車';
const car = [
  {
    name: 'トヨタ・ハイエースバン',
    category: '社用車',
    id: 23,
  },
  {
    name: '日産・NV350キャラバン',
    category: '社用車',
    id: 24,
  },
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

describe('Top', () => {
  it('1 Should render components correctly in Top component', async () => {
    render(<Top />);
    // screen.debug();
    expect(screen.getByText('会議室')).toBeInTheDocument();
    expect(screen.getByText('社用車')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
  });

  it('2 Should render components correctly in Items component when props is PC', async () => {
    render(<Items category={category_PC} items={pc} />);
    // screen.debug();
    expect(screen.getAllByTestId('card')[0]).toBeTruthy();
    expect(screen.getAllByTestId('card')[1]).toBeTruthy();
    expect(screen.getAllByTestId('card')[2]).toBeTruthy();
    expect(screen.getByAltText('Surface - 01')).toBeTruthy();
    expect(screen.getByAltText('ThinkPad - 01')).toBeTruthy();
    expect(screen.getByAltText('ThinkPad - 02')).toBeTruthy();
    expect(screen.getByText('Surface - 01')).toBeInTheDocument();
    expect(screen.getByText('ThinkPad - 01')).toBeInTheDocument();
    expect(screen.getByText('ThinkPad - 02')).toBeInTheDocument();
  });

  it('3 Should render components correctly in Items component when props is room', async () => {
    render(<Items category={category_room} items={room} />);
    // screen.debug();
    expect(screen.getAllByTestId('card')[0]).toBeTruthy();
    expect(screen.getAllByTestId('card')[1]).toBeTruthy();
    expect(screen.getByAltText('大会議室')).toBeTruthy();
    expect(screen.getByAltText('中会議室')).toBeTruthy();
    expect(screen.getByText('大会議室')).toBeInTheDocument();
    expect(screen.getByText('中会議室')).toBeInTheDocument();
  });

  it('4 Should render components correctly in Items component when props is car', async () => {
    render(<Items category={category_car} items={car} />);
    // screen.debug();
    expect(screen.getAllByTestId('card')[0]).toBeTruthy();
    expect(screen.getAllByTestId('card')[1]).toBeTruthy();
    expect(screen.getByAltText('トヨタ・ハイエースバン')).toBeTruthy();
    expect(screen.getByAltText('日産・NV350キャラバン')).toBeTruthy();
    expect(screen.getByText('トヨタ・ハイエースバン')).toBeInTheDocument();
    expect(screen.getByText('日産・NV350キャラバン')).toBeInTheDocument();
  });

  it('5 Should navigate when click card', async () => {
    render(<Items category={category_PC} items={pc} />);
    await userEvent.click(screen.getAllByTestId('card')[0]);
    expect(mockNavigate).toBeCalledWith('/*');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
