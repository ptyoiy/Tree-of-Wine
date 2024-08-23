import { Box, Paper } from '@mui/material';
import { WineData } from '../../../utils/makeTree';
import { Search } from '../search';


const LeftSection = ({ csvData }: { csvData: WineData[] }) => {
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
      <Search data={csvData} />
      <Paper>selected list</Paper>
    </Box>
  );
};

export default LeftSection;
