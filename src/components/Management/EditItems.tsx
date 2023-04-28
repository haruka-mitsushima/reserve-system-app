import Box from '@mui/material/Box';
import styles from '../../styles/Top.module.css';
import EditItemBox from './EditItemBox';
import { Item } from '../../types/Item';

type Props = { category: string; items: Array<Item> };

const EditItems = ({ category, items }: Props) => {
  return (
    <div className={styles.Top}>
      <Box sx={{ fontWeight: 'bold', fontSize: 'h3.fontSize', mb: 2, mt: 3 }}>
        {category}
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          py: 4,
          px: 1,
          mb: 2,
          bgcolor: 'background.paper',
          height: 'justifyContent',
          width: 800,
          borderRadius: 10,
          boxShadow: 10,
          gap: 3,
        }}
      >
        {items.map((item) => (
          <EditItemBox {...item} key={item.id} />
        ))}
      </Box>
    </div>
  );
};

export default EditItems;
