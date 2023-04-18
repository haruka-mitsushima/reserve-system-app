import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import AddItem from '../components/AddItem';
import userEvent from '@testing-library/user-event';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

const handlers = [
  rest.post('http://localhost:8000/Items', (req, res, ctx) => {
    return res(ctx.status(200));
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

describe('AddItem', () => {
  it('1 Should render all the elements correctly', () => {
    render(<AddItem />);
    expect(screen.getByText('設備を追加する')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeTruthy();
    expect(screen.getByText('名前')).toBeInTheDocument();
    expect(screen.getByTestId('select')).toBeTruthy();
    expect(screen.getByText('タグ')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeTruthy();
    expect(screen.getByText('登録する')).toBeInTheDocument();
  });

  it('2 Should add item and navigate top', async () => {
    render(<AddItem />);
    const inputValue = screen.getByRole('textbox');
    await userEvent.type(inputValue, 'ウィンドウズ');
    const selectCompoEl = screen.getByTestId('select');
    const button = within(selectCompoEl).getByRole(
      'button',
    ) as HTMLInputElement;
    fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const options = within(listbox).getAllByRole('option');
    fireEvent.click(options[2]);
    expect(button).toHaveTextContent('PC');
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toBeCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('3 Should return if input is empty', async () => {
    render(<AddItem />);
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });
});
