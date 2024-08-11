import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ErrorBoundary from './components/layout/ErrorBoundary.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
    {setTimeout(() => console.log("root"))}
  </>
  // </React.StrictMode>,
);
console.log("outside")
setTimeout(() => console.log("timeout outside"));