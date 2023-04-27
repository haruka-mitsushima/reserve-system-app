import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import Router from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { getUserInfo, sessionStorageMock } from './sessionStorage';
import ItemPage from '../components/Items/ItemPage';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

// windowオブジェクトのsessionStorageをsessionStorageMockプロパティに変更
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

const server = setupServer(
  rest.get(`http://localhost:8000/reservations/`, (req, res, ctx) => {
    const query = req.url.searchParams;
    const itemId = query.get('item.id');
    if (itemId === '1') {
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
            endTime: '10:00',
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
            date: '2023-04-20',
            startTime: '10:00',
            endTime: '11:00',
            user: {
              id: 2,
              name: 'test',
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
beforeEach(() => {
  window.sessionStorage.setItem(
    'auth',
    JSON.stringify({ id: 1, name: 'test' }),
  );
  jest.restoreAllMocks();
  jest.spyOn(Router, 'useNavigate').mockImplementation(() => mockNavigate)
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('ItemPage component Test', () => {
  it('should get UserInfo from sessionStorage', () => {
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');
  });
  it('should render the ItemPage', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
    render(
      <MemoryRouter initialEntries={[`/item/:id`]}>
        <ItemPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByText('予約状況は以下のようになっています'),
    ).toBeInTheDocument();
    expect(await screen.findByText('test1')).toBeInTheDocument();
    expect(screen.getAllByText('大会議室')[0]).toBeInTheDocument();
    expect(screen.getByText('2023/04/19')).toBeInTheDocument();
    expect(screen.getByText('9:00~10:00')).toBeInTheDocument();
    expect(screen.getByTestId('btn-nav-1')).toBeTruthy();
    expect(await screen.findByText('test2')).toBeInTheDocument();
    expect(screen.getAllByText('大会議室')[1]).toBeInTheDocument();
    expect(screen.getByText('2023/04/20')).toBeInTheDocument();
    expect(screen.getByText('10:00~11:00')).toBeInTheDocument();
    expect(screen.getByTestId('btn-nav-5')).toBeTruthy();
  });

  it('should render the Msg when Reservation item is Empty', async () => {
    server.use(
      rest.get(`http://localhost:8000/reservations/`, (req, res, ctx) => {
        const query = req.url.searchParams;
        const itemId = query.get('item.id');
        if (itemId === '2') {
          return res(ctx.status(200), ctx.json([]));
        }
      }),
    );
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '2' });
    render(
      <MemoryRouter initialEntries={[`/item/:id`]}>
        <ItemPage />
      </MemoryRouter>,
    );
    expect(screen.queryByText('現在予約は入っておりません')).toBeNull();
    expect(
      await screen.findByText('現在予約は入っておりません'),
    ).toBeInTheDocument();
  });

  it('should call useNavigate when button was clicked', async () => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ id: '1' });
    render(
        <MemoryRouter initialEntries={[`/item/:id`]}>
          <ItemPage />
        </MemoryRouter>
    );
    expect(screen.queryByTestId('btn-nav-1')).toBeNull();
    expect(await screen.findByTestId('btn-nav-1')).toBeTruthy();
    expect(screen.getAllByText('修正・削除')[0]).toBeInTheDocument();
    await userEvent.click(screen.getByTestId('btn-nav-1'));
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/reserve/edit/1');
  });
});
