import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
// フォームのコンポーネント
import Pulldown from './ReservePulldown';
import ReserveDate from './ReserveDateTime';
import ReserveBtn from './ReserveBtn';

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
    const detailItems = categories.filter((category) => category === value);
    let item = await fetchGetItems(detailItems[0]);
    setItemDetailes(item);
  };

  return (
    <>
      <main>
        <h1>設備予約</h1>
        <div>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              required
              id="outlined-required"
              label="タイトル"
              placeholder="用途を記入してください"
              onChange={(e) =>
                dispatch(add({ ...addItems, title: e.target.value }))
              }
            />
            <FormControl fullWidth>
              <InputLabel id="select-label">設備を選択してください</InputLabel>
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
          </Box>
          <Pulldown isSelect={isSelect} items={itemDetailes} />
          <ReserveDate />
        </div>
        <ReserveBtn />
      </main>
    </>
  );
};

export default Reserve;
