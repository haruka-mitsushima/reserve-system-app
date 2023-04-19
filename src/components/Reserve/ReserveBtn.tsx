import { Button, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import styles from '../../styles/addReserve.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { selectAdd, add } from '../../features/addReserveSlice';
import axios from 'axios';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

// エラーがaxiosに関するエラーか確かめる
function isAxiosError(error: any): error is AxiosError {
  return !!error.isAxiosError;
}

const ReserveBtn = () => {
  const [err, setErr] = useState<string | undefined>('');
  const [isFilledIn, setIsFilledIn] = useState(true);
  const [userId, setUserId] = useState(0);
  const [successMsg, setSuccessMsg] = useState('');

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

  // addItems内に空文字があるかチェック
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

  const handleClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!notEmpty(addItems)) {
      setIsFilledIn(false);
      return;
    }

    try {
      await axios.post(`http://localhost:8000/reservations`, addItems);
      const req = await axios.get(`http://localhost:8000/users/${userId}`);
      const data = req.data;
      const item = data.reservedItem;
      item.push(addItems);
      await axios.patch(`http://localhost:8000/users/${userId}`, {
        reservedItem: item,
      });

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
      navigate(`/Completed`);
    } catch (e) {
      if (isAxiosError(e)) {
        setErr(e.response?.statusText);
      }
    }
  };

  return (
    <div>
      {err}
      {successMsg}
      {isFilledIn || <p className={styles.center}>空欄箇所があります！</p>}
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
