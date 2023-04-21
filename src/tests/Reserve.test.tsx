import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reserve from '../components/Reserve/Reserve';
import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import addReserveReducer from '../features/addReserveSlice';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

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
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  server.resetHandlers();
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
    window.sessionStorage.setItem(
      'auth',
      JSON.stringify({ id: 1, name: 'test' }),
    );
    getUserInfo();
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

    // 設備のセレクトのテスト
    const select = screen.getByTestId('select');
    const button = within(select).getByRole('button') as HTMLInputElement;
    await fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const options = within(listbox).getAllByRole('option');
    await userEvent.click(options[1]);
    expect(button).toHaveTextContent('社用車');

    // 設備の詳細のテスト
    const selectDetail = screen.getByTestId('select-detailSeg');
    const btnDetail = within(selectDetail).getByRole(
      'button',
    ) as HTMLInputElement;
    await fireEvent.mouseDown(btnDetail);
    const listDetail = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const optionsDetail = within(listDetail).getAllByRole('option');
    await userEvent.click(optionsDetail[0]);
    expect(btnDetail).toHaveTextContent('社用車2');

    // 日付のテスト
    const inputDate = screen.getByTestId('date-input') as HTMLInputElement;
    fireEvent.change(inputDate, { target: { value: '2023-04-17' } });
    expect(inputDate.value).toBe('2023-04-17');

    // 開始時刻のテスト
    const selectStart = screen.getByTestId('select-start');
    const btnEnd = within(selectStart).getByRole('button') as HTMLInputElement;
    await fireEvent.mouseDown(btnEnd);
    const listEnd = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const optionEnd = within(listEnd).getAllByRole('option');
    await userEvent.click(optionEnd[0]);
    expect(btnEnd).toHaveTextContent('9:00');

    // 終了時刻のテスト
    const selectEnd = screen.getByTestId('select-start');
    const btnStart = within(selectEnd).getByRole('button') as HTMLInputElement;
    await fireEvent.mouseDown(btnStart);
    const listStart = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const optionStart = within(listStart).getAllByRole('option');
    await userEvent.click(optionStart[1]);
    expect(btnStart).toHaveTextContent('9:30');

    await userEvent.click(screen.getByTestId('btn-post'));

    expect(await screen.findByText('OK')).toBeInTheDocument();
    expect(mockNavigate).toBeCalledWith('/Completed');
    expect(mockNavigate).toBeCalledTimes(1);
  });
});
