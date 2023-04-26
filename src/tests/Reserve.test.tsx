import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reserve from '../components/Reserve/Reserve';
import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import addReserveReducer from '../features/addReserveSlice';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { getUserInfo, sessionStorageMock } from './sessionStorage';
import { selectOption } from './selectOption';

// useNavigateのMock
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// windowオブジェクトのsessionStorageをsessionStorageMockプロパティに変更
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true,
});

const handlers = [
  rest.get(`http://localhost:8000/items/`, (req, res, ctx) => {
    const query = req.url.searchParams;
    const category = query.get('category');
    if (category === '社用車') {
      return res(
        ctx.status(200),
        ctx.json([{ id: 2, name: '社用車2', category: '社用車' }]),
      );
    }
  }),
  rest.post(`http://localhost:8000/reservations`, (req, res, ctx) => {
    return res(ctx.status(201));
  }),
  rest.get(`http://localhost:8000/users/`, (req, res, ctx) => {
    const query = req.url.searchParams;
    const userId = query.get('userId');
    if (userId === '1') {
      return res(
        ctx.status(200),
        ctx.json([
          {
            title: 'sample',
            item: {
              id: 2,
              name: '社用車2',
            },
            date: '2023-04-20',
            startTime: '10:00',
            endTime: '11:00',
            user: {
              id: 1,
              name: 'test',
            },
            id: 1,
          },
        ]),
      );
    }
  }),
  rest.patch(`http://localhost:8000/users/1`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          title: 'sample',
          item: {
            id: 2,
            name: '社用車2',
          },
          date: '2023-04-20',
          startTime: '10:00',
          endTime: '11:00',
          user: {
            id: 1,
            name: 'test',
          },
          id: 1,
        },
      ]),
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
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
  cleanup();
});
afterAll(() => {
  server.close();
});

describe('Reserve Component Test Case', () => {
  let store: Store<unknown, AnyAction>;
  beforeEach(() => {
    store = configureStore({
      reducer: {
        addReserve: addReserveReducer,
      },
    });
  });
  it('should render all the elements correctlly', () => {
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    expect(screen.getByRole('heading')).toBeTruthy();
    expect(
      screen.getByPlaceholderText('用途を記入してください'),
    ).toBeInTheDocument();
    expect(screen.getByText('設備を選択してください')).toBeInTheDocument();
    expect(screen.getByText('日付を選択してください')).toBeInTheDocument();
    expect(screen.getByText('開始時刻を選択してください')).toBeInTheDocument();
    expect(screen.getByText('終了時刻を選択してください')).toBeInTheDocument();
    expect(screen.getByTestId('btn-post')).toBeTruthy();
    expect(screen.getByText('登録する')).toBeTruthy();
  });

  it('should add new reservation and move to completed page', async () => {
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');

    const inputValue = screen.getByPlaceholderText('用途を記入してください');
    await userEvent.type(inputValue, 'sample');

    // 設備のセレクト
    await selectOption('select', 1, '社用車');

    // 設備の詳細のセレクト
    await selectOption('select-detailSeg', 0, '社用車2');

    // 日付のセレクト
    const inputDate = screen.getByTestId('date-input') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '2023-04-20' } });
    expect(inputDate.value).toBe('2023-04-20');

    // 開始時刻のセレクト
    await selectOption('select-start', 2, '10:00');

    // 終了時刻のセレクト
    await selectOption('select-end', 4, '11:00');

    await userEvent.click(screen.getByTestId('btn-post'));

    expect(await screen.findByText('OK')).toBeInTheDocument();
    expect(mockNavigate).toBeCalledTimes(1);
    expect(mockNavigate).toBeCalledWith('/Completed');
  });

  it('should validation Msg when the input is Empty', async () => {
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');
    await userEvent.click(screen.getByTestId('btn-post'));
    expect(await screen.findByTestId('validation-1')).toBeTruthy();
  });

  it('should validation Msg when the startTims and endTime are not correct', async () => {
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');
    // input項目を埋める
    const inputValue = screen.getByPlaceholderText('用途を記入してください');
    await userEvent.type(inputValue, 'sample');
    await selectOption('select', 1, '社用車');
    await selectOption('select-detailSeg', 0, '社用車2');
    const inputDate = screen.getByTestId('date-input') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '2023-04-20' } });
    expect(inputDate.value).toBe('2023-04-20');
    await selectOption('select-start', 4, '11:00');
    await selectOption('select-end', 2, '10:00');
    await userEvent.click(screen.getByTestId('btn-post'));
    expect(await screen.findByTestId('validation-2')).toBeTruthy();
  });

  it('should render the ErrorMsg when fetch failed', async () => {
    server.use(
      rest.get(`http://localhost:8000/reservations`, (req, res, ctx) => {
        return res(ctx.status(404));
      }),
    );
    render(
      <Provider store={store}>
        <Reserve />
      </Provider>,
    );
    const getItemSpy = jest.spyOn(window.sessionStorage, 'getItem');

    const actualValue = getUserInfo();
    expect(actualValue).toEqual({ id: 1, name: 'test' });
    expect(getItemSpy).toBeCalledWith('auth');
    // input項目を埋める
    const inputValue = screen.getByPlaceholderText('用途を記入してください');
    await userEvent.type(inputValue, 'sample');
    await selectOption('select', 1, '社用車');
    await selectOption('select-detailSeg', 0, '社用車2');
    const inputDate = screen.getByTestId('date-input') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '2023-04-20' } });
    expect(inputDate.value).toBe('2023-04-20');
    await selectOption('select-start', 2, '10:00');
    await selectOption('select-end', 4, '11:00');
    await userEvent.click(screen.getByTestId('btn-post'));
    expect(await screen.findByTestId('errMsg')).toBeTruthy();
  });
});
