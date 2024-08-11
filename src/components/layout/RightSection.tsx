import { Box, Paper } from '@mui/material';
import { Tree } from '../../utils/makeTree';
import { BubbleChart } from '../charts/bubble';

type SectionProps = {
  data: Tree;
};

const RightSection = ({ data }: SectionProps) => {
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
        <BubbleChart data={data} />
      </Paper>
      <Paper sx={{}}>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
