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

const category = 'PC';
const items = [
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
    expect(screen.getByText('会議室')).toBeInTheDocument();
    expect(screen.getByText('社用車')).toBeInTheDocument();
    expect(screen.getByText('PC')).toBeInTheDocument();
    expect(await screen.findAllByTestId('card')).toBeTruthy();
    expect(screen.getAllByTestId('card')[0]).toBeTruthy();
    expect(screen.getAllByTestId('card')[1]).toBeTruthy();
    expect(screen.getAllByTestId('card')[2]).toBeTruthy();
    expect(screen.getAllByTestId('card')[3]).toBeTruthy();
  });

  it('2 Should render components correctly in Items component', async () => {
    render(<Items category={category} items={items} />);
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

  it('3 Should navigate when click card', async () => {
    render(<Items category={category} items={items} />);
    await userEvent.click(screen.getAllByTestId('card')[0]);
    expect(mockNavigate).toBeCalledWith('/*');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
