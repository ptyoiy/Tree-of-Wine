import { Box, Paper } from '@mui/material';
import { WineData } from '../../utils/makeTree';
import { BubbleChart } from '../charts/bubble';

type SectionProps = {
  data: WineData[];
  columns: (keyof WineData)[];
};

const RightSection = ({ data, columns }: SectionProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr',
        height: '100vh',
        width: '350px',
        border: 'solid 1px black',
        gap: '1px',
      }}
    >
      <Paper sx={{}}>
        <BubbleChart data={data} columns={columns} />
      </Paper>
      <Paper sx={{}}>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
