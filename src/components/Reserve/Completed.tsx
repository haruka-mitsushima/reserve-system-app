import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import styles from '../../styles/addReserve.module.css';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Reservation } from '../../types/Reservation';


export const Completed = () => {
  const [item, setItem] = useState<Reservation>();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchGetItems = async () => {
      const reservations = await axios.get(
        `http://localhost:8000/reservations`,
      );
      const result: Reservation[] = reservations.data;
      // 配列の最後を取得(一番新しく追加された予約)
      const newItem = result.slice(-1)[0];
      setItem(newItem);
    };
    fetchGetItems();
  }, []);


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