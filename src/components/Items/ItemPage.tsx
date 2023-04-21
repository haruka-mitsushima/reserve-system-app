import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Reservation } from '../../types/Reservation';
import styles from '../../styles/ItemPage.module.css';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const ItemPage = () => {
  const [item, setItem] = useState<Reservation[]>([]);
  const [isEmpty, setIsEmpty] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const user = sessionStorage.getItem('auth');

  useEffect(() => {
    if (user === null) {
      navigate('/login');
    }
    const fetchItem = async () => {
      const result = await axios.get(
        `http://localhost:8000/reservations?item.id=${id}`,
      );
      if (!result.data.length) {
        setIsEmpty(true);
      } else {
        let reservations = result.data;
        reservations = reservations.map((item: any) => {
          return {
            ...item,
            date: item.date.replace(/-/g, `/`),
          };
        });
        setItem(reservations);
      }
    };
    fetchItem();
  }, [id, navigate, user]);

  console.log(item);

  return (
    <>
      <main className={styles.content}>
        <div className={styles.titleWrapper}>
          {isEmpty ? (
            <p className={styles.title}>現在予約は入っておりません</p>
          ) : (
            <p className={styles.title}>予約状況は以下のようになっています</p>
          )}
        </div>
        <div>
          <ul>
            {item?.map((item) => (
              <li key={item.id} className={styles.list}>
                <div className={styles.listContent}>
                  <p>{item.title}</p>
                  <p>{item.item.name}</p>
                  <p>
                    <span>日にち：</span>
                    {item.date}
                  </p>
                  <p>
                    <span>予約時間：</span>
                    {item.startTime}~{item.endTime}
                  </p>
                </div>
                <div>
                  <Button
                    className={styles.btn}
                    data-testid="btn-nav"
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      mb: 2,
                      bgcolor: '#4970a3',
                      fontSize: 16,
                      width: 150,
                      ':hover': { background: '#3b5a84' },
                    }}
                    onClick={() => navigate(`/${item.id}`)}
                  >
                    修正・削除
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
};

export default ItemPage;
