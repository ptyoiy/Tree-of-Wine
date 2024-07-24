import { Container, Paper, ToggleButton } from '@mui/material';
import { useMemo, useState } from 'react';
import { RadialDendrogram } from './components/charts';
import { LoadingBoundary } from './components/layout/LoadingBoundary';
import { useWineDataCsv } from './utils/csvHandler';
import { makeTree, WineData } from './utils/makeTree';

/**
 * Tree of Wine의 분기 순서
 ** 배열 요소 순서대로 분기됨
 ** 데이터가 없는 속성의 경우 분기되지 않음
 * @example const columns = ['Country', 'Region', 'EstateDate', 'Designation']
 * 위 상황에서 만약 분기 도중 EstateDate 속성의 값이 없을 경우
 * Country, Region, Designation 3단계로 분기됨
 */
const columns: (keyof WineData)[] = ['Country', 'Region', 'EstateDate', 'Designation'];
function App() {
  const { data: csvData, isLoading } = useWineDataCsv();
  const { data, fittingToTheEnd, handleToggleChange } = useData(csvData);
  return (
    <LoadingBoundary isLoading={isLoading}>
      <Container>
        <Paper
          elevation={5}
          sx={{ display: 'flex', 'align-items': 'flex-start', overflow: 'hidden' }}
        >
          <RadialDendrogram
            width={700}
            fontSize={9.5}
            data={data}
            columns={columns}
            fittingToTheEnd={fittingToTheEnd}
          />
          <ToggleButton
            selected={fittingToTheEnd}
            value={'fittingToTheEnd'}
            onChange={handleToggleChange}
          >
            fitting To The End
          </ToggleButton>
        </Paper>
      </Container>
    </LoadingBoundary>
  );
}

function useData(csvData: WineData[]) {
  const [fittingToTheEnd, setFittingToTheEnd] = useState(false);
  const handleToggleChange = () => setFittingToTheEnd(!fittingToTheEnd);
  const data = useMemo(() => makeTree(csvData, ...columns), [csvData]);

  return { data, fittingToTheEnd, handleToggleChange };
}

export default App;
