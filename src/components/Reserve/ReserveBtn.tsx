import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/addReserve.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ReserveBtn = () => {
  const [err, setErr] = useState(false);
  const [isFilledIn, setIsFilledIn] = useState(true);
  const [userId, setUserId] = useState(0);
  const [success, setSuccess] = useState('');
  const [TimeisCorrect, setTimeisCorrect] = useState(true);

  const addItems = useSelector(selectAdd);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ユーザーデータ取得
  let data = sessionStorage.getItem('auth');

  useEffect(() => {
    if (data !== null) {
      const user = JSON.parse(data);
      dispatch(
        add({
          ...addItems,
          user: user,
        }),
      );
      setUserId(user.id);
    }
  }, [data]);

  type addItem = {
    title: string;
    item: { id: 0; name: string };
    date: string;
    startTime: string;
    endTime: string;
    user: { id: number; name: string };
  };

  // addItems内に空文字があるかバリデーション
  function notEmpty(addItems: addItem) {
    if (
      addItems.title === '' ||
      addItems.item.name === '' ||
      addItems.date === '' ||
      addItems.startTime === '' ||
      addItems.endTime === ''
    ) {
      return false;
    }
    return true;
  }

  // 時間をNumberに変換する関数(バリデーションに使用)
  function timeConvert(time: string) {
    let hour_mins = time.replace(':', '');
    return Number(hour_mins);
  }
  const startTime = timeConvert(addItems.startTime);
  const endTime = timeConvert(addItems.endTime);

  // 登録ボタンを押したとき
  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // バリデーション
    if (!notEmpty(addItems)) {
      setIsFilledIn(false);
      return;
    } else {
      setIsFilledIn(true);
    }
    // 時間指定のバリデーション
    if (startTime > endTime || startTime === endTime) {
      setTimeisCorrect(false);
      return;
    }

    try {
      await axios.post(`http://localhost:8000/reservations`, addItems);
      const req = await axios.get(
        `http://localhost:8000/reservations?userId=${userId}`,
      );
      const data = req.data;
      const statusMsg = await axios.patch(
        `http://localhost:8000/users/${userId}`,
        {
          reservedItem: data,
        },
      );
      // ユーザーのreservedItemを更新できたらsuccessの状態を更新する（テストのため）
      setSuccess(statusMsg.statusText);
      // addItemsの値をリセット
      dispatch(
        add({
          title: '',
          item: { id: 0, name: '' },
          date: '',
          startTime: '9:00',
          endTime: '9:00',
          user: { id: 0, name: '' },
        }),
      );
    } catch (e) {
      setErr(true);
    }
  };

  useEffect(() => {
    if (success === 'OK') {
      navigate('/Completed');
    }
  }, [navigate, success]);

  return (
    <div>
      {success}
      {isFilledIn || (
        <p className={styles.center} data-testid="validation-1">
          空欄箇所があります！
        </p>
      )}
      {TimeisCorrect || (
        <p className={styles.center} data-testid="validation-2">
          時間を正しく指定してください
        </p>
      )}
      {err && (
        <p data-testid="errMsg">通信エラーです。時間をおいて再度お試し下さい</p>
      )}
      <Button
        className={styles.btn}
        data-testid="btn-post"
        type="submit"
        variant="contained"
        sx={{
          mt: 3,
          mb: 2,
          bgcolor: '#4970a3',
          fontSize: 16,
          width: 200,
          ':hover': { background: '#3b5a84' },
        }}
        onClick={handleClick}
      >
        登録する
      </Button>
    </div>
  );
};

export default ReserveBtn;
