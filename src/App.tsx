import { Container, Paper, ToggleButton } from '@mui/material';
import { useMemo, useState } from 'react';
import { RadialDendrogram } from './components/charts/TreeOfWine';
import AppNavbar from './components/layout/appbar/AppNavbar.tsx';
import LeftSection from './components/layout/LeftSection.tsx';
import { LoadingBoundary } from './components/layout/LoadingBoundary';
import RightSection from './components/layout/RightSection.tsx';
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
const columns: (keyof WineData)[] = ['Country', 'Region', 'Designation'];

function App() {
  const { data: csvData, isLoading } = useWineDataCsv();
  const { treeData, fittingToTheEnd, handleToggleChange } = useData(csvData);
  return (
    <LoadingBoundary isLoading={isLoading}>
      <AppNavbar />
      <Container
        maxWidth="xl"
        sx={{
          display: '-webkit-box',
          height: '100vh',
          margin: '0'
        }}
      >
        <LeftSection />
        <Paper
          elevation={5}
          sx={{
            display: 'grid',
            gridTemplateRows: '50px auto',
            gridTemplateColumns: 'auto 150px',
            width: 'fit-content',
            height: '100vh',
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
            width={800}
            fontSize={9.5}
            data={treeData}
            fittingToTheEnd={fittingToTheEnd}
          />
        </Paper>
        <RightSection data={treeData} />
      </Container>
    </LoadingBoundary>
  );
}

function useData(csvData: WineData[]) {
  const [fittingToTheEnd, setFittingToTheEnd] = useState(false);
  const handleToggleChange = () => setFittingToTheEnd(!fittingToTheEnd);
  const treeData = useMemo(() => makeTree(csvData, ...columns), [csvData]);
  return { treeData, fittingToTheEnd, handleToggleChange };
}

export default App;
