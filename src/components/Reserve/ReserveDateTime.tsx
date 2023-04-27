import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import styles from '../../styles/addReserve.module.css';
import { times } from './time';

const ReserveDateTime = () => {
  const [value, setValue] = useState('');
  const dispatch = useDispatch();
  const addItems = useSelector(selectAdd);

  return (
    <div>
      <div className={styles.mb}>
        <Grid item xs={12}>
          <label htmlFor="data">日付を選択してください</label>
          <input
            data-testid="date-input"
            className={styles.dateForm}
            type="date"
            name="calendar"
            max="9999-12-31"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              dispatch(
                add({
                  ...addItems,
                  date: e.target.value,
                }),
              );
            }}
          />
        </Grid>
      </div>
      <div className={styles.mb}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="select-label">
              開始時刻を選択してください
            </InputLabel>
            <Select
              data-testid="select-start"
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
        </Grid>
      </div>
      <div className={styles.mb}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="select-label">
              終了時刻を選択してください
            </InputLabel>
            <Select
             data-testid="select-end"
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
        </Grid>
      </div>
    </div>
  );
};

export default ReserveDateTime;
