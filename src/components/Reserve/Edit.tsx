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
import { useParams } from 'react-router-dom';
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
                        defaultValue={startTime}
                      >
                        {times.map((time) => (
                          <MenuItem
                            value={time}
                            key={time}
                            onChange={(e: any) => {
                              setStartTime(e.target.value);
                            }}
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
                        defaultValue={endTime}
                      >
                        {times.map((time) => (
                          <MenuItem
                            value={time}
                            key={time}
                            onChange={(e: any) => {
                              setEndTime(e.target.value);
                            }}
                          >
                            {time}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    mt: 7,
                    mb: 2,
                    bgcolor: '#4970a3',
                    fontSize: 16,
                    width: 200,
                    ':hover': { background: '#3b5a84' },
                  }}
                >
                  更新する
                </Button>
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
