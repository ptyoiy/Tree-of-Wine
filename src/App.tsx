import { Container } from '@mui/material';
import { useMemo } from 'react';
import { AppNavbar } from './components/layout/appNavbar';
import { LoadingBoundary } from './components/layout/LoadingBoundary';
import { LeftSection, MainSection, RightSection } from './components/layout/sections';
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
  const { treeData } = useData(csvData);
  return (
    <LoadingBoundary isLoading={isLoading}>
      <AppNavbar />
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
          margin: '0',
        }}
      >
        <LeftSection />
        <MainSection data={treeData} />
        <RightSection data={treeData} />
      </Container>
    </LoadingBoundary>
  );
}

function useData(csvData: WineData[]) {
  const treeData = useMemo(() => makeTree(csvData, ...columns), [csvData]);
  return { treeData };
}

export default App;
