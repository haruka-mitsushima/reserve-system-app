import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoginIcon from '@mui/icons-material/Login';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useDispatch } from 'react-redux';
import { fetchAsyncLogin } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';
import Grid from '@mui/material/Grid';
import { Link } from '@mui/material';

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await dispatch(
      fetchAsyncLogin({ email: email, password: password }),
    );
    if (fetchAsyncLogin.fulfilled.match(result)) {
      navigate('/');
    } else {
      return;
    }
  };

  return (
    <Container component="main" maxWidth={false} sx={{ maxWidth: '100%' }}>
      <Grid container>
        <Grid item xs={3}></Grid>
        <Grid item xs={6} place-content="center">
          <Box
            sx={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: 8,
              paddingBottom: 8,
              bgcolor: '#fff',
              boxShadow: 10,
              borderRadius: 10,
            }}
          >
            <Avatar sx={{ m: 1 }}>
              <LoginIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={handleSubmit}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                ログイン
              </Button>
              <Grid container>
                <Grid item xs={8}></Grid>
                <Grid item xs={4}>
                  <Link href="/register">{'ユーザー登録はこちら'}</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={3}></Grid>
      </Grid>
    </Container>
  );
}
