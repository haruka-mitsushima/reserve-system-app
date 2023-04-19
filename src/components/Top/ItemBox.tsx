import Card from './Card';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { Item } from '../../types/Item';

const ItemBox = (item: Item) => {
  let imageUrl = '';
  switch (item.category) {
    case '会議室':
      imageUrl = 'room.png';
      break;
    case '社用車':
      imageUrl = 'car.png';
      break;
    case 'PC':
      imageUrl = 'pc.png';
      break;
    default:
      break;
  }
  return (
    <Link to={`/item/${item.id}`}>
      <Card>
        <img src={imageUrl} alt="" height={100} />
        <Typography component="p" variant="h5" fontWeight="bold">
          {item.name}
        </Typography>
      </Card>
    </Link>
  );
};

export default ItemBox;
