import { Box, Paper } from '@mui/material';
import { Tree, WineData } from '../../../utils/makeTree';
import { BubbleChart } from '../../charts/bubble';

type SectionProps = {
  data: WineData | Tree;
};

const RightSection = ({ data }: SectionProps) => {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '1fr 1fr 1fr',
        border: 'solid 1px black',
        gap: '1px',
      }}
    >
      <Paper>
        <BubbleChart data={data} />
      </Paper>
      <Paper>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
