import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
// フォームのコンポーネント
import Pulldown from './ReservePulldown';
import ReserveDate from './ReserveDateTime';
import ReserveBtn from './ReserveBtn';
import styles from '../../styles/addReserve.module.css';

type Items = {
  id: number;
  name: string;
  category: string;
};

const Reserve = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [itemDetailes, setItemDetailes] = useState<Items[]>();
  const dispatch = useDispatch();
  const addItems = useSelector(selectAdd);

  // カテゴリー
  const categories = ['会議室', '社用車', 'PC'];

  async function fetchGetItems(item: string) {
    const items = await axios.get(
      `http://localhost:8000/items?category=${item}`,
    );
    return items.data;
  }

  // カテゴリーのvalueを変更する
  const changeHandler = async (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSelectedItem(value);
    setIsSelect(true);
    let item = await fetchGetItems(value);
    setItemDetailes(item);
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles.boxWrapper}>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'white',
              borderRadius: 10,
              py: 0,
              px: 4,
              height: 600,
              width: 800,
              boxShadow: 10,
            }}
            noValidate
            autoComplete="off"
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h1>設備予約</h1>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <TextField
                    required
                    id="outlined-required"
                    label="タイトル"
                    placeholder="用途を記入してください"
                    onChange={(e) =>
                      dispatch(add({ ...addItems, title: e.target.value }))
                    }
                    className={styles.main}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel data-testid="select-label">
                    設備を選択してください
                  </InputLabel>
                  <Select
                    labelId="select-label"
                    id="demo-simple-select"
                    label="item"
                    value={selectedItem}
                    onChange={changeHandler}
                  >
                    <MenuItem value="会議室">会議室</MenuItem>
                    <MenuItem value="社用車">社用車</MenuItem>
                    <MenuItem value="PC">PC</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Pulldown isSelect={isSelect} items={itemDetailes} />
              </Grid>
              <Grid item xs={12}>
                <ReserveDate />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <ReserveBtn />
            </Grid>
          </Box>
        </div>
      </main>
    </>
  );
};

export default Reserve;
