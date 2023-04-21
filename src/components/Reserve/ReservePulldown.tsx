import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';

type Items = {
  id: number;
  name: string;
  category: string;
};

function Pulldown({
  isSelect,
  items,
}: {
  isSelect: boolean;
  items: Items[] | undefined;
}) {
  const [detailItem, setDeteilItem] = useState('');
  const dispatch = useDispatch();
  const addItems = useSelector(selectAdd);

  return (
    <>
      {isSelect ? (
        <FormControl fullWidth>
          <InputLabel id="select-label">詳細を選択してください</InputLabel>
          <Select
            data-testid="select-detailSeg"
            labelId="select-label"
            id="demo-simple-select"
            label="detailitem"
            onChange={(e) => setDeteilItem(e.target.value)}
            value={detailItem}
          >
            {items?.map((item) => (
              <MenuItem
                value={item.name}
                key={item.id}
                onClick={() => {
                  dispatch(
                    add({
                      ...addItems,
                      item: { id: item.id, name: item.name },
                    }),
                  );
                }}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ) : null}
    </>
  );
}

export default Pulldown;
