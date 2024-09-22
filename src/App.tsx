import { Container } from '@mui/material';
import { AppNavbar } from './components/layout/appNavbar';
import { LeftSection, MainSection, RightSection } from './components/layout/sections';

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
        <MainSection />
        <RightSection />
      </Container>
    </>
  );
}

export default App;
