import { Button, createTheme, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Reservation } from '../../types/Reservation';
import { useQuery } from '@tanstack/react-query';
import { times } from './time';

const Edit = () => {
  const { id } = useParams();

  const fetchReservation = async () => {
    const res = await axios(`http://localhost:8000/reservations?id=${id}`);
    return res.data;
  };

  const { data } = useQuery(['reserve'], fetchReservation);
  const [reservation, setReservation] = useState<Reservation>(data[0]);

  const [title, setTitle] = useState(reservation?.title);
  const [date, setDate] = useState(reservation?.date);
  const [startTime, setStartTime] = useState(reservation?.startTime);
  const [endTime, setEndTime] = useState(reservation?.endTime);
  const navigate = useNavigate();

  const updateReserve = {
    title: title,
    date: date,
    startTime: startTime,
    endTime: endTime,
  };
  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .patch(`http://localhost:8000/reservations/${id}`, updateReserve)
      .then(() => navigate('/mypage'));
  };

  const deleteHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    axios
      .delete(`http://localhost:8000/reservations/${id}`)
      .then(() => navigate('/mypage'));
  };

  const theme = createTheme({
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#ececec',
          },
        },
      },
    },
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth={false} sx={{ maxWidth: '100%' }}>
          <CssBaseline />
          <Grid container>
            <Grid item xs={1}></Grid>
            <Grid item xs={10} place-content="center">
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
                  boxShadow: 10,
                  textAlign: 'left',
                  marginY: 16,
                  paddingTop: 12,
                  paddingBottom: 8,
                }}
                noValidate
                autoComplete="off"
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                      <Typography component="h1" variant="h3">
                        予約の更新： {reservation?.item.name}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Typography>タイトルを入力してください</Typography>
                      <TextField
                        required
                        id="outlined-required"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography>日付を選択してください</Typography>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Typography>開始時刻を選択してください</Typography>
                      <Select
                        id="demo-simple-select"
                        label="time"
                        value={startTime}
                      >
                        {times.map((time) => (
                          <MenuItem
                            value={time}
                            key={time}
                            onClick={() => setStartTime(time)}
                          >
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <Typography>終了時刻を選択してください</Typography>
                      <Select
                        id="demo-simple-select"
                        label="time"
                        value={endTime}
                      >
                        {times.map((time) => (
                          <MenuItem
                            value={time}
                            key={time}
                            onClick={() => {
                              setEndTime(time);
                            }}
                          >
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 7,
                      mb: 2,
                      mr: 2,
                      bgcolor: '#4970a3',
                      fontSize: 16,
                      width: 200,
                      ':hover': { background: '#3b5a84' },
                    }}
                    onClick={submitHandler}
                  >
                    更新する
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 7,
                      mb: 2,
                      ml: 2,
                      bgcolor: 'orange',
                      fontSize: 16,
                      width: 200,
                      ':hover': { background: '#3b5a84' },
                      textAlign: 'right',
                    }}
                    onClick={deleteHandler}
                  >
                    削除する
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={1}></Grid>
          </Grid>
        </Container>
      </ThemeProvider>
    </>
  );
};

export default Edit;
