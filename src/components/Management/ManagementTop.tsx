import React, { useEffect } from 'react';
import styles from '../../styles/AddItem.module.css';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '../Top/Card';

const ManagementTop = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const auth = sessionStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
  }, [navigate]);
  return (
    <div className={styles.AddItem}>
      <Typography component="h1" variant="h3" fontWeight="bold" sx={{ mb: 3 }}>
        管理者用画面
      </Typography>
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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card
              onClick={() => {
                navigate('/manage/addItem');
              }}
            >
              <Typography component="p" variant="h5" fontWeight="bold">
                設備の追加
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card
              onClick={() => {
                navigate('/manage/select');
              }}
            >
              <Typography component="p" variant="h5" fontWeight="bold">
                設備の編集・削除
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default ManagementTop;
