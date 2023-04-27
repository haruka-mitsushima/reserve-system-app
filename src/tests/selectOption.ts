import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// inputの入力関数
export async function selectOption(
  selectTestId: string,
  optionIndex: number,
  expectedTextContent: string,
) {
  const select = screen.getByTestId(selectTestId);
  const button = within(select).getByRole('button') as HTMLInputElement;
  await fireEvent.mouseDown(button);
  const listbox = within(screen.getByRole('presentation')).getByRole('listbox');
  const options = within(listbox).getAllByRole('option');
  await userEvent.click(options[optionIndex]);
  expect(button).toHaveTextContent(expectedTextContent);
}

export async function selectDate(selectTestId: string, selectDate: string) {
  const inputDate = screen.getByTestId(selectTestId) as HTMLInputElement;
  fireEvent.change(inputDate, { target: { value: selectDate } });
  expect(inputDate.value).toBe(selectDate);
}

export async function inputValue(placeHolder: string, text: string) {
  const inputValue = screen.getByPlaceholderText(placeHolder);
  await userEvent.type(inputValue, text);
}
