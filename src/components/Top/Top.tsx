import React, { useEffect, useState } from 'react';
import styles from '../../styles/Top.module.css';
import axios from 'axios';
import Items from './Items';
import { Item } from '../../types/Item';
import { useNavigate } from 'react-router-dom';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';

const Top = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>([]);
  const categories = ['会議室', '社用車', 'PC'];
  useEffect(() => {
    axios.get('http://localhost:8000/items').then((res) => setItems(res.data));
    const auth = sessionStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className={styles.Top}>
      {categories.map((category) => (
        <Items
          key={category}
          category={category}
          items={items.filter((item) => item.category === category)}
        />
      ))}
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="/manage" variant="body2">
            {'管理画面はこちら'}
          </Link>
        </Grid>
      </Grid>
    </div>
  );
};

export default Top;
