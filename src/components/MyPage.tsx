import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../types/Reservation';
import Button from '@mui/material/Button';

export default function MyPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const user = sessionStorage.getItem('auth');

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    } else {
      const userObj = JSON.parse(user);
      const userId = userObj.id;
      axios
        .get(`http://localhost:8000/reservations?user.id=${userId}`)
        .then((res) => setReservations(res.data));
    }
  }, [navigate, user]);

  const clickHandler = (reservation: Reservation) => {
    navigate(`/reserve/edit/${reservation.id}`);
  };

  return (
    <Container component="main" maxWidth={false} sx={{ maxWidth: '100%' }}>
      <Grid container>
        <Grid item xs={1}></Grid>
        <Grid item xs={10} place-content="center">
          <Box
            sx={{
              marginY: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingY: 8,
              bgcolor: '#fff',
              boxShadow: 10,
              borderRadius: 10,
              textAlign: 'center',
            }}
          >
            <Typography component="h1" variant="h4" data-testid="reserve-title">
              現在の予約状況を表示しています。
            </Typography>
            <Box sx={{ mt: 3 }}>
              {reservations.map((reservation: Reservation) => {
                return (
                  <Box sx={{ width: 1000 }} key={reservation.id}>
                    <Typography
                      variant="h4"
                      sx={{
                        mr: 1,
                        border: 1,
                        borderRadius: 5,
                        paddingX: 4,
                        marginY: 4,
                      }}
                    >
                      <Grid container spacing={2} paddingY={4}>
                        <Grid
                          item
                          xs={2}
                          data-testid={`date-${reservation.id}`}
                        >
                          {reservation.date.replaceAll('-', '/')}
                        </Grid>
                        <Grid
                          item
                          xs={2}
                          data-testid={`time-${reservation.id}`}
                        >
                          {reservation.startTime}~{reservation.endTime}
                        </Grid>
                        <Grid item xs={2.5}>
                          {reservation.title}
                        </Grid>
                        <Grid item xs={4}>
                          {reservation.item.name}
                        </Grid>
                        <Grid item xs={1.5}>
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ fontSize: 16 }}
                            onClick={() => clickHandler(reservation)}
                            data-testid={`button-${reservation.id}`}
                          >
                            編集
                          </Button>
                        </Grid>
                      </Grid>
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </Container>
  );
}
