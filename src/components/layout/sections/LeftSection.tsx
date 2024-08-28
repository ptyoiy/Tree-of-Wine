import { Box } from '@mui/material';
import { Search } from '../search';
import { Table } from '../table';

const LeftSection = () => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        width: '20%',
        border: 'solid 1px black',
        gap: '1px',
      }}
    >
      <Search />
      <Table />
    </Box>
  );
};

export default LeftSection;
