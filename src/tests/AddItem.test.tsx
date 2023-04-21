import React from 'react';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import AddItem from '../components/Management/AddItem';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
const itemsMock: [] = [];
const existingItemsMock = [
  {
    name: '大会議室',
    category: '会議室',
    id: 1,
  },
];

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
    axiosMock.get.mockResolvedValue({ data: itemsMock });
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
    await waitFor(() =>
      expect(axiosMock.get).toHaveBeenCalledWith(
        'http://localhost:8000/items?name=ウィンドウズ',
      ),
    );
    await waitFor(() =>
      expect(axiosMock.post).toHaveBeenCalledWith(
        'http://localhost:8000/items',
        {
          category: 'PC',
          name: 'ウィンドウズ',
        },
      ),
    );
    expect(mockNavigate).toBeCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('3 Should return if name is already existing', async () => {
    render(<AddItem />);
    axiosMock.get.mockResolvedValue({ data: existingItemsMock });
    const inputValue = screen.getByRole('textbox');
    await userEvent.type(inputValue, '大会議室');
    const selectCompoEl = screen.getByTestId('select');
    const button = within(selectCompoEl).getByRole(
      'button',
    ) as HTMLInputElement;
    fireEvent.mouseDown(button);
    const listbox = within(screen.getByRole('presentation')).getByRole(
      'listbox',
    );
    const options = within(listbox).getAllByRole('option');
    fireEvent.click(options[0]);
    expect(button).toHaveTextContent('会議室');
    await userEvent.click(screen.getByTestId('button'));
    expect(axiosMock.get).toHaveBeenCalledWith(
      'http://localhost:8000/items?name=大会議室',
    );
    expect(
      screen.getByText('大会議室は既に登録されています'),
    ).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });

  it('4 Should return if input is empty', async () => {
    render(<AddItem />);
    await userEvent.click(screen.getByTestId('button'));
    expect(mockNavigate).toHaveBeenCalledTimes(0);
  });
});
