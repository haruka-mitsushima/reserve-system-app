import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import axios from 'axios';

type Category = {
  id: string;
  items: string[];
};

const Reserve = () => {
  const [selectedItem, setSelectedItem] = useState('');
  const [isSelect, setIsSelect] = useState(false);
  const [items, setItems] = useState<Category[]>([]);
  const [itemDetailes, setItemDetailes] = useState<any>();

  // カテゴリーのデータを取得
  useEffect(() => {
    const fetchCategories = async () => {
      const items = await axios.get('http://localhost:8000/categories');
      setItems(items.data);
    };
    fetchCategories();
  }, []);

  // カテゴリーのvalueを変更する
  const changeHandler = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setSelectedItem(value);
    setIsSelect(true);
    const detaileItems = items.filter((item) => item.id === value);
    setItemDetailes(detaileItems);
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
                {items.map((item) => (
                  <MenuItem value={item.id} key={item.id}>
                    {item.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <DetailItem isSelect={isSelect} itemDetailes={itemDetailes} />
        </div>
        <form action=""></form>
      </main>
    </>
  );
};

function DetailItem({
  isSelect,
  itemDetailes,
}: {
  isSelect: boolean;
  itemDetailes: Category[];
}) {
  const [detailItem, setDeteilItem] = useState('');
  const [items, setItems] = useState<string[]>([]);

  // MenuItemのvalueを変更する
  useEffect(() => {
    if (itemDetailes !== undefined) {
      setItems(itemDetailes[0].items);
    }
  }, [itemDetailes]);

  return (
    <>
      {isSelect ? (
        <FormControl fullWidth>
          <InputLabel id="select-label">詳細を選択してください</InputLabel>
          <Select
            labelId="select-label"
            id="demo-simple-select"
            label="detailitem"
            onChange={(e) => setDeteilItem(e.target.value)}
            value={detailItem}
          >
            {items?.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </>
  );
}

export default Reserve;
