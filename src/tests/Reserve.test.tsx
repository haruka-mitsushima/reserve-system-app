import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reserve from '../components/Reserve/Reserve';
import { AnyAction, configureStore, Store } from '@reduxjs/toolkit';
import addReserveReducer from '../features/addReserveSlice';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Completed } from '../components/Reserve/Completed';


const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));


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
  rest.post('http://localhost:8000/reservations', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        title: 'sample',
        item: {
          id: 2,
          name: '社用車2',
        },
        date: '2023-04-17',
        startTime: '10:00',
        endTime: '17:00',
        user: {
          id: 1,
          name: 'test',
        },
        id: 1,
      }),
    );
  }),
  rest.patch('http://localhost:8000/users/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          name: 'test',
          email: 'test1@example.com',
          password: 'password',
          reservedItem: [
            {
              title: 'sample',
              item: {
                id: 2,
                name: '社用車2',
              },
              date: '2023-04-17',
              startTime: '10:00',
              endTime: '17:00',
              user: {
                id: 1,
                name: 'test',
              },
              id: 1,
            },
          ],
        },
      }),
    );
  }),
  rest.get('http://localhost:8000/users/1', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        user: {
          name: 'test3',
          email: 'test3@example.com',
          password: 'password',
          reservedItem: [
            {
              title: 'sample',
              item: {
                id: 2,
                name: '社用車2',
              },
              date: '2023-04-17',
              startTime: '10:00',
              endTime: '17:00',
              user: {
                id: 1,
                name: 'test',
              },
              id: 1,
            },
          ],
        },
      }),
    );
  }),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
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
    const inputValue = screen.getByPlaceholderText('用途を記入してください');
    await userEvent.type(inputValue, 'sample');

    // 設備のセレクトのテスト
    const select = screen.getByTestId('select-segment');
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
    // screen.debug()
    // expect(await screen.findByText('OK')).toBeInTheDocument();
    // expect(mockNavigate).toBeCalledWith('/Completed/0');
    // expect(mockNavigate).toBeCalledTimes(1);
  });
  it('should render the added new reservation', async () => {
    render(<Completed />);
    expect(screen.queryByText('sample')).toBeNull();
    expect(screen.queryByText('社用車2')).toBeNull();
    expect(screen.queryByText('2023-04-17')).toBeNull();
    expect(screen.queryByText('10:00')).toBeNull();
    expect(screen.queryByText('17:00')).toBeNull();
    expect(screen.queryByText('test')).toBeNull();
    expect(screen.getByText('以下の予約が完了しました！')).toBeInTheDocument();
    expect(await screen.findByText('タイトル：sample')).toBeInTheDocument();
    expect(screen.getByText('設備：社用車2')).toBeInTheDocument();
    expect(screen.getByText('日付：2023-04-17')).toBeInTheDocument();
    expect(screen.getByText('開始時刻：10:00')).toBeInTheDocument();
    expect(screen.getByText('終了時刻：17:00')).toBeInTheDocument();
    expect(screen.getByText('ユーザー：test')).toBeInTheDocument();
  });
});
