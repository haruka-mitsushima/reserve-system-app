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
