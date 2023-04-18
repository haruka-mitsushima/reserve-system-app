import React, { useEffect, useState } from 'react';
import styles from '../../styles/Top.module.css';
import axios from 'axios';
import Items from './Items';
import { Item } from '../../types/Item';
import { useNavigate } from 'react-router-dom';

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
    </div>
  );
};

export default Top;
