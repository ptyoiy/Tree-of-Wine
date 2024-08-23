import { createTheme, ThemeProvider } from '@mui/material';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/layout/ErrorBoundary.tsx';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 기본 primary 색상 설정
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ErrorBoundary>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </ErrorBoundary>

  // </React.StrictMode>,
);
