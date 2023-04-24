import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Completed } from '../components/Reserve/Completed';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

function getUserInfo() {
  const userInfo = window.sessionStorage.getItem('auth');
  if (userInfo) {
    return JSON.parse(userInfo);
  }
  return {};
}

type StoreType = {
  [key: string]: string;
};

const sessionStorageMock = (() => {
  let store: StoreType = {};

  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  // 上書き可能にするため
  writable: true,
});

const handlers = [
  rest.get('http://localhost:8000/users/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        name: 'test',
        email: 'test1@example.com',
        password: 'password',
        reservedItem: [
          {
            title: 'test1',
            item: {
              id: 23,
              name: 'トヨタ・ハイエースバン',
            },
            date: '2023-04-19',
            startTime: '9:00',
            endTime: '9:00',
            user: {
              id: 2,
              name: 'test',
            },
            id: 1,
          },
          {
            title: 'sample',
            item: {
              id: 2,
              name: '社用車1',
            },
            date: '2023-04-20',
            startTime: '10:00',
            endTime: '11:00',
            user: {
              id: 2,
              name: 'test',
            },
            id: 2,
          },
        ],
        id: 1,
      }),
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
  jest.restoreAllMocks();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe('Completed component Test Cases', () => {
  it('should setItem correctly of sessionStorage', () => {
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');
    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');
  });

  it('should render the new reserved item correctlly', async () => {
    render(<Completed />);
    expect(screen.queryByText('タイトル：sample')).toBeNull();
    expect(screen.queryByText('設備：社用車1')).toBeNull();
    expect(screen.queryByText('日付：2023/04/20')).toBeNull();
    expect(screen.queryByText('開始時刻：10:00')).toBeNull();
    expect(screen.queryByText('終了時刻：11:00')).toBeNull();
    expect(screen.queryByText('ユーザー：test')).toBeNull();
    expect(screen.getByText('以下の予約が完了しました！')).toBeInTheDocument();
    expect(await screen.findByText('タイトル：sample')).toBeInTheDocument();
    expect(screen.getByText('設備：社用車1')).toBeInTheDocument();
    expect(screen.getByText('日付：2023/04/20')).toBeInTheDocument();
    expect(screen.getByText('開始時刻：10:00')).toBeInTheDocument();
    expect(screen.getByText('終了時刻：11:00')).toBeInTheDocument();
    expect(screen.getByText('ユーザー：test')).toBeInTheDocument();
  });

  it('should call useNavigate Mock when button clicked', async () => {
    render(<Completed />);
    const button = screen.getByTestId('button');
    await userEvent.click(button);
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/reserve');
  });

  it('sshould not render list of the added reservation when fetch failed', async () => {
    server.use(
      rest.get('http://localhost:8000/users/1', (req, res, ctx) => {
        return res(ctx.status(404));
      }),
    );
    render(<Completed />);
    expect(screen.queryByText('タイトル：sample')).toBeNull();
    expect(screen.queryByText('設備：社用車1')).toBeNull();
    expect(screen.queryByText('日付：2023/04/20')).toBeNull();
    expect(screen.queryByText('開始時刻：10:00')).toBeNull();
    expect(screen.queryByText('終了時刻：11:00')).toBeNull();
    expect(screen.queryByText('ユーザー：test')).toBeNull();
    expect(await screen.findByTestId('errorMsg')).toBeTruthy();
    expect(await screen.findByText('Fetch Failed')).toBeInTheDocument();
    expect(screen.queryByText('タイトル：sample')).toBeNull();
    expect(screen.queryByText('設備：社用車1')).toBeNull();
    expect(screen.queryByText('日付：2023/04/20')).toBeNull();
    expect(screen.queryByText('開始時刻：10:00')).toBeNull();
    expect(screen.queryByText('終了時刻：11:00')).toBeNull();
    expect(screen.queryByText('ユーザー：test')).toBeNull();
  });
});
