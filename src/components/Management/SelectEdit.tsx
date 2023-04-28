import React, { useEffect, useState } from 'react';
import styles from '../../styles/Top.module.css';
import axios from 'axios';
import { Item } from '../../types/Item';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import EditItems from './EditItems';

const SelectEdit = () => {
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
      <Typography component="h1" variant="h3" fontWeight="bold" sx={{ mt: 5 }}>
        編集する設備を選択してください
      </Typography>
      {categories.map((category) => (
        <EditItems
          key={category}
          category={category}
          items={items.filter((item) => item.category === category)}
        />
      ))}
    </div>
  );
};

export default SelectEdit;
