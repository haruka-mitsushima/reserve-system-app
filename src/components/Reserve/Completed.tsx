import React, { Suspense, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styles from '../../styles/addReserve.module.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../../types/Reservation';
import { useParams } from 'react-router-dom';

export const Completed = () => {
  const [userId, setUserId] = useState(0);
  const [item, setItem] = useState<Reservation>();
  const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>();

  let data = sessionStorage.getItem('auth');

  useEffect(() => {
    let id;
    const fetchUser = async () => {
      if (data === null) {
        return;
      }
      const tmp = JSON.parse(data);
      id = tmp.id;
      const result = await axios.get(`http://localhost:8000/users/${id}`);
      const newReservation = await result.data.reservedItem.slice(-1)[0];
      setItem(newReservation);
    };
    fetchUser();
  }, [data]);

  return (
    <>
      <div className={styles.boxWrapper}>
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
            height: 550,
            width: 600,
            boxShadow: 10,
          }}
        >
          <h2 className={styles.title}>以下の予約が完了しました！</h2>
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
              height: 400,
              width: 400,
              border: 1,
              borderColor: '#999',
            }}
          >
            <div className={styles.item}>
              <p>タイトル：{item?.title}</p>
              <p>設備：{item?.item.name}</p>
              <p>日付：{item?.date}</p>
              <p>開始時刻：{item?.startTime}</p>
              <p>終了時刻：{item?.endTime}</p>
              <p>ユーザー：{item?.user.name}</p>
            </div>
          </Box>
          <Button
            className={styles.btn}
            data-testid="button"
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              width: 200,
              fontSize: 16,
              bgcolor: '#4970a3',
              ':hover': { background: '#3b5a84' },
            }}
            onClick={() => navigate('/reserve')}
          >
            続けて登録する
          </Button>
        </Box>
      </div>
    </>
  );
};
