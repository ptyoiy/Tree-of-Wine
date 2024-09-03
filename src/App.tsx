import { Container } from '@mui/material';
import { AppNavbar } from './components/layout/appNavbar';
import { LeftSection, MainSection, RightSection } from './components/layout/sections';

/**
 * Tree of Wine의 분기 순서
 ** 배열 요소 순서대로 분기됨
 ** 데이터가 없는 속성의 경우 분기되지 않음
 * @example const columns = ['Country', 'Region', 'EstateDate', 'Designation']
 * 위 상황에서 만약 분기 도중 EstateDate 속성의 값이 없을 경우
 * Country, Region, Designation 3단계로 분기됨
 */

function App() {
  return (
    <>
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
        {/* <MainSection /> */}
        <RightSection />
      </Container>
    </>
  );
}

export default App;
