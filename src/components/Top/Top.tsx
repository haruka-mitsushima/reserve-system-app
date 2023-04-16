import React, { useEffect, useState } from 'react';
import styles from '../../styles/Top.module.css';
import axios from 'axios';
import Items from './Items';
import { Item } from '../../types/Item';

const Top = () => {
  const [items, setItems] = useState<Item[]>([]);
  const categories = ['会議室', '社用車', 'PC'];
  useEffect(() => {
    axios.get('http://localhost:8000/items').then((res) => setItems(res.data));
  }, []);

  return (
    <div className={styles.Top}>
      {categories.map((category) => (
        <Items
          category={category}
          items={items.filter((item) => item.category === category)}
        />
      ))}
    </div>
  );
};

export default Top;
