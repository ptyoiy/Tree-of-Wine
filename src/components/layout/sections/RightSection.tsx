import { Box, Paper } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { treeDataSelector } from '../../../recoil/wineData';
import { BubbleChart } from '../../charts/bubble';
import { Chart } from '../../charts/wrapper';

const RightSection = () => {
  const data = useRecoilValue(treeDataSelector);
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
      <Chart render={BubbleChart} chartProps={{ data }} />
      <Paper>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
