import { Box, Paper } from '@mui/material';
import { Tree, WineData } from '../../../utils/makeTree';
import { BubbleChart } from '../../charts/bubble';
import { Chart } from '../../charts/wrapper';

type SectionProps = {
  data: WineData | Tree;
};
const RightSection = (data: SectionProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr',
        border: 'solid 1px black',
        width: '20%',
        gap: '1px',
      }}
    >
      <Chart render={BubbleChart} chartProps={data} />
      <Paper>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
