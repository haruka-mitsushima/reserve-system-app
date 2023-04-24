import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Router } from 'react-router-dom';
import ItemPage from '../components/Items/ItemPage';
import { MemoryRouter, Route } from 'react-router-dom';

const mockNavigate = jest.fn();
// jest.mock('react-router-dom', () => ({
//   useNavigate: () => mockNavigate,
// }));

const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => {
  return {
    useParams: () => ({
      id: '1',
    }),
    useNavigate: () => mockNavigate,
  };
});

const server = setupServer(
  rest.get(`http://localhost:8000/reservations/`, (req, res, ctx) => {
    const query = req.url.searchParams;
    console.log(query);
    const item = query.get('item.id');
    console.log(item);
    if (item === '1') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            title: 'test1',
            item: {
              id: 1,
              name: '大会議室',
            },
            date: '2023-04-19',
            startTime: '9:00',
            endTime: '9:00',
            user: {
              id: 1,
              name: 'test',
            },
            id: 1,
          },
          {
            title: 'test2',
            item: {
              id: 1,
              name: '大会議室',
            },
            date: '2023-04-19',
            startTime: '9:00',
            endTime: '9:00',
            user: {
              id: 2,
              name: 'モジャ',
            },
            id: 5,
          },
        ]),
      );
    }
  }),
);

beforeAll(() => {
  server.listen();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('ItemPage component Test', () => {
  it('render the reservedItem', async () => {
    const id = 1;
    // render(
    //   <MemoryRouter initialEntries={[`/item/${id}`]}>
    //     <Route path="/user/:id">
    //       <ItemPage />
    //     </Route>
    //   </MemoryRouter>,
    // );
    // expect(mockUseParams).toHaveBeenCalledTimes(1);
    // expect(
    //   screen.getByText('予約状況は以下のようになっています'),
    // ).toBeInTheDocument();
    // expect(screen.queryByText('test1')).toBeNull();
    // expect(await screen.findByText('test1')).toBeInTheDocument();
  });
});
