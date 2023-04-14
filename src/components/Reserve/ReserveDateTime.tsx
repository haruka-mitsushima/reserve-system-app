import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const times = [
  '9:00',
  '9:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
];

const ReserveDateTime = () => {
  const dispatch = useDispatch();
  const addItems = useSelector(selectAdd);
  return (
    <div>
      <form>
        <input
          type="date"
          name="calendar"
          max="9999-12-31"
          onChange={(e) => {
            dispatch(
              add({
                ...addItems,
                date: e.target.value,
              }),
            );
          }}
        />
        <div>
          <FormControl fullWidth>
            <InputLabel id="select-label">
              開始時刻を選択してください
            </InputLabel>
            <Select
              labelId="select-label"
              id="demo-simple-select"
              label="time"
              defaultValue={times[0]}
            >
              {times.map((time) => (
                <MenuItem
                  value={time}
                  key={time}
                  onClick={() => {
                    dispatch(add({ ...addItems, startTime: time }));
                  }}
                >
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth>
            <InputLabel id="select-label">
              終了時刻を選択してください
            </InputLabel>
            <Select
              labelId="select-label"
              id="demo-simple-select"
              label="time"
              defaultValue={times[0]}
            >
              {times.map((time) => (
                <MenuItem
                  value={time}
                  key={time}
                  onClick={() => {
                    dispatch(add({ ...addItems, endTime: time }));
                  }}
                >
                  {time}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </form>
    </div>
  );
};

export default ReserveDateTime;
