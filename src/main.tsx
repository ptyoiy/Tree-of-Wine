import { createTheme, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import { RecoilRoot } from 'recoil';
import App from './App.tsx';
import ErrorBoundary from './components/layout/ErrorBoundary.tsx';
import { LoadingBoundary } from './components/layout/LoadingBoundary.tsx';
import './index.css';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <RecoilRoot>
    <ErrorBoundary>
      <LoadingBoundary>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </LoadingBoundary>
    </ErrorBoundary>
  </RecoilRoot>

  // </React.StrictMode>,
);
