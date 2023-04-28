import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import styles from '../../styles/AddItem.module.css';

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

const EditItem = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
  }, [navigate]);

  const { id } = useParams();
  const { data, refetch } = useQuery(['itemData'], () =>
    axios.get(`http://localhost:8000/items/${id}`).then((res) => res.data),
  );

  const [name, setName] = useState<string>(data.name);
  const [categoryName, setCategoryName] = useState<string>(data.category);
  const [errMsg, setErrMsg] = useState<string>('');

  const { mutate } = useMutation(
    () =>
      axios.patch(`http://localhost:8000/items/${id}`, {
        name,
        categoryName,
      }),
    {
      onSuccess: () => {
        refetch();
        navigate('/');
      },
    },
  );

  const handleChange = (event: SelectChangeEvent<typeof categoryName>) => {
    const {
      target: { value },
    } = event;
    setCategoryName(value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !categoryName) return;

    const res = await axios.get(`http://localhost:8000/items?name=${name}`);
    const existingItems = res.data;
    if (existingItems.length > 0) {
      setErrMsg(`${name}は既に登録されています`);
      return;
    }

    mutate();
    navigate('/');
  };

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await axios.delete(`http://localhost:8000/items?name=${name}`);
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
          設備を編集する
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
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="名前"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Button
                data-testid="postButton"
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: '#4970a3',
                  ':hover': { background: '#3b5a84' },
                }}
                onClick={() => handleSubmit}
              >
                更新する
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                data-testid="button"
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  bgcolor: 'orange',
                  ':hover': { background: '#E48E00' },
                }}
                onClick={() => handleDelete}
              >
                削除する
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </div>
  );
};

export default EditItem;
