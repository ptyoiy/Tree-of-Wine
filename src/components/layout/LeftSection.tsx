import { Box, Paper } from '@mui/material';


const LeftSection = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '4fr 6fr',
        width: '20%',
        border: 'solid 1px black',
        gap: '1px',
      }}
    >
      <Paper>search</Paper>
      <Paper>selected list</Paper>
    </Box>
  );
};

export default LeftSection;
