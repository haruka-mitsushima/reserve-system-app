import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styles from '../../styles/addReserve.module.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Reservation } from '../../types/Reservation';

export const Completed = () => {
  const [newReservation, setNewRservation] = useState<Reservation>();
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();

  let data = sessionStorage.getItem('auth');

  useEffect(() => {
    let userId;
    const fetchLatestReservation = async () => {
      if (data === null) {
        navigate('/login');
        return;
      }
      try {
        const tmp = JSON.parse(data);
        userId = tmp.id;
        const result = await axios.get(`http://localhost:8000/users/${userId}`);

        if (result.data.reservedItem.length > 0) {
          let newReservation = await result.data.reservedItem.slice(-1)[0];
          newReservation = {
            ...newReservation,
            // yyyy-mm-ddをyyyy/mm/ddに変換
            date: newReservation.date.replace(/-/g, `/`),
          };
          setNewRservation(newReservation);
        }
      } catch (e) {
        setErrorMsg(true);
      }
    };
    fetchLatestReservation();
  }, [data, navigate]);

  return (
    <>
      {errorMsg ? (
        <div className={styles.error}>
          <p data-testid="errorMsg">Fetch Failed</p>
          <p>通信エラーです。時間を置いて再度お試しください。</p>
        </div>
      ) : (
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
                <p>タイトル：{newReservation?.title}</p>
                <p>設備：{newReservation?.item.name}</p>
                <p>日付：{newReservation?.date}</p>
                <p>開始時刻：{newReservation?.startTime}</p>
                <p>終了時刻：{newReservation?.endTime}</p>
                <p>ユーザー：{newReservation?.user.name}</p>
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
      )}
    </>
  );
};
