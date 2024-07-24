import { Container, Paper, ToggleButton } from '@mui/material';
import { useMemo, useState } from 'react';
import { RadialDendrogram } from './components/charts';
import { useWineDataCsv } from './utils/csvHandler';
import { makeTree, WineData } from './utils/makeTree';

const columns: (keyof WineData)[] = ['Country', 'Region', 'EstateDate', 'Designation'];
function App() {
  const { data: csvData, isLoading } = useWineDataCsv();
  const data = useMemo(() => makeTree(csvData, ...columns), [csvData]);
  const [fittingToTheEnd, setFittingToTheEnd] = useState(false);
  if (isLoading) return <>...loading</>;
  return (
    <Container>
      <Paper elevation={5} sx={{ display: 'flex', 'align-items': 'flex-start' }}>
        <RadialDendrogram
          width={660}
          data={data}
          columns={columns}
          fittingToTheEnd={fittingToTheEnd}
        />
        <ToggleButton
          selected={fittingToTheEnd}
          value={'fittingToTheEnd'}
          onChange={() => setFittingToTheEnd(!fittingToTheEnd)}
        >
          fitting To The End
        </ToggleButton>
      </Paper>
    </Container>
  );
}

export default App;
