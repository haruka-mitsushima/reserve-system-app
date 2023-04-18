import React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function MyPage() {
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
                マイページ
              </Typography>
              <Box component="form" noValidate sx={{ mt: 3 }}>
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
                    />
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
