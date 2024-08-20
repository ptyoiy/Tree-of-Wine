import { Paper, ToggleButton } from '@mui/material';
import { useState } from 'react';
import { Tree, WineData } from '../../../utils/makeTree';
import { RadialDendrogram } from '../../charts/TreeOfWine';

type MainSectionProps = {
  data: WineData | Tree;
};

export default function MainSection({ data }: MainSectionProps) {
  const [fittingToTheEnd, setFittingToTheEnd] = useState(false);
  const handleToggleChange = () => setFittingToTheEnd(!fittingToTheEnd);
  return (
    <Paper
      elevation={5}
      sx={{
        display: 'grid',
        gridTemplateRows: '10% auto',
        gridTemplateColumns: '90% auto',
        width: '60%',
        overflow: 'hidden',
      }}
    >
      <ToggleButton
        sx={{
          position: 'relative',
          right: 0,
          gridRow: '1 / 2',
          gridColumn: '2 / 3',
          justifySelf: 'center',
          alignSelf: 'center',
        }}
        selected={fittingToTheEnd}
        value={'fittingToTheEnd'}
        onChange={handleToggleChange}
      >
        fitting To The End
      </ToggleButton>
      <RadialDendrogram
        width={650}
        fontSize={9.5}
        data={data}
        fittingToTheEnd={fittingToTheEnd}
      />
    </Paper>
  );
}
