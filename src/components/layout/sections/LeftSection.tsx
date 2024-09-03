import { Box } from '@mui/material';
import { Search } from '../search';
import { Table } from '../table';
import Virtualize from '../search/ListBox';

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
      {/* <Table /> */}
      <Virtualize />
    </Box>
  );
};

export default LeftSection;
