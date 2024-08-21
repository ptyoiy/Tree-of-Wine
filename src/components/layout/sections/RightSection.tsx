import { Box, Paper } from '@mui/material';
import { MutableRefObject, useRef } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import { BubbleChart } from '../../charts/bubble';


type SectionProps = {
  data: WineData | Tree;
};
const RightSection = ({ data }: SectionProps) => {
  const section1Ref = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>;
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
      <Paper ref={section1Ref}>
        <BubbleChart data={data} parentRef={section1Ref} />
      </Paper>
      <Paper>Select Statistic Info Chart</Paper>
      <Paper>Mini-Map</Paper>
    </Box>
  );
};

export default RightSection;
