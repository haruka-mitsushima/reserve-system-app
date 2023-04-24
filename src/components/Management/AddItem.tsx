import React, { FormEvent, useState } from 'react';
import styles from '../../styles/AddItem.module.css';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import axios from 'axios';

const categories = ['会議室', '社用車', 'PC'];
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const AddItem = () => {
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState<string>('');
  const [errMsg, setErrMsg] = useState<string>('');

  const handleChange = (event: SelectChangeEvent<typeof categoryName>) => {
    const {
      target: { value },
    } = event;
    setCategoryName(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString();
    const category = data.get('category')?.toString();
    if (!name || !category) return;

    const res = await axios.get(`http://localhost:8000/items?name=${name}`);
    const existingItems = res.data;
    if (existingItems.length > 0) {
      setErrMsg(`${name}は既に登録されています`);
      return;
    }

    await axios.post('http://localhost:8000/items', { name, category });
    navigate('/');
  };

  return (
    <div className={styles.AddItem}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'white',
          borderRadius: 10,
          py: 0,
          px: 4,
          height: 450,
          width: 500,
          boxShadow: 10,
        }}
      >
        <Typography component="h1" variant="h5">
          設備を追加する
        </Typography>
        {errMsg && (
          <Typography
            component="h1"
            variant="h6"
            sx={{ color: 'red', mt: 2 }}
            data-testid="errMsg"
          >
            {errMsg}
          </Typography>
        )}
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="名前"
                name="name"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl sx={{ width: 500 }} required>
                <InputLabel id="category">タグ</InputLabel>
                <Select
                  data-testid="select"
                  labelId="category"
                  id="category"
                  name="category"
                  value={categoryName}
                  onChange={handleChange}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Chip" />
                  }
                  MenuProps={MenuProps}
                >
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            data-testid="button"
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              bgcolor: '#4970a3',
              ':hover': { background: '#3b5a84' },
            }}
          >
            登録する
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AddItem;
