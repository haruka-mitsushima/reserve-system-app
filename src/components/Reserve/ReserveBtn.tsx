import { Button, FormControl } from '@mui/material';
import React from 'react';
import styles from '../../styles/addReserve.module.css';

const ReserveBtn = () => {
  return (
    <div>
        <Button
          className={styles.btn}
          data-testid="button"
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            mt: 3,
            mb: 2,
            bgcolor: '#4970a3',
            ':hover': { background: '#3b5a84' },
          }}
        >
          登録する
        </Button>
    </div>
  );
};

export default ReserveBtn;
