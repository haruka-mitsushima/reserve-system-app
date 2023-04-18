import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fetchAsyncRegister } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { Link } from '@mui/material';

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

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name || !email || !password) {
      alert('未入力の項目があります');
      return;
    }
    const result = await dispatch(
      fetchAsyncRegister({
        name: name,
        email: email,
        password: password,
        reservedItem: [],
      }),
    );
    console.log(result);
    if (fetchAsyncRegister.fulfilled.match(result)) {
      navigate('/login');
    } else {
      return;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth={false} sx={{ maxWidth: '100%' }}>
        <CssBaseline />
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
                <HowToRegIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h5">
                Register
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="name"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      autoFocus
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  ユーザー登録
                </Button>
                <Grid container>
                  <Grid item xs={8.5}></Grid>
                  <Grid item xs={3.5}>
                    <Link href="/login">{'登録済みの方はこちら'}</Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
