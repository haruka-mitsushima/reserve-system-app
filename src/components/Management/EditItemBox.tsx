import Card from '../Top/Card';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Item } from '../../types/Item';

const EditItemBox = (item: Item) => {
  const navigate = useNavigate();
  let imageUrl = '';
  switch (item.category) {
    case '会議室':
      imageUrl = 'http://localhost:3000/room.png';
      break;
    case '社用車':
      imageUrl = 'http://localhost:3000/car.png';
      break;
    case 'PC':
      imageUrl = 'http://localhost:3000/pc.png';
      break;
    default:
      break;
  }
  return (
    <Card
      onClick={() => navigate(`/manage/editItem/${item.id}`)}
      data-testid="card"
    >
      <img src={imageUrl} alt={item.name} height={100} />
      <Typography
        component="p"
        variant="h5"
        fontWeight="bold"
        data-testid={`name-${item.id}`}
      >
        {item.name}
      </Typography>
    </Card>
  );
};

export default EditItemBox;
