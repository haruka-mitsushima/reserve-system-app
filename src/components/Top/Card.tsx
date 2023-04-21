import Box, { BoxProps } from '@mui/material/Box';

function Card(props: BoxProps, keyId: string) {
  const { ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        bgcolor: 'grey.100',
        color: 'grey.800',
        border: '1px solid',
        borderColor: 'grey.300',
        borderRadius: 2,
        fontSize: '0.875rem',
        fontWeight: '700',
        width: 200,
        height: 150,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: 1,
        cursor: 'pointer',
      }}
      {...other}
    />
  );
}

export default Card;
