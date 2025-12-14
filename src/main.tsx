import { render } from 'solid-js/web';
import App from './app/App.jsx';
import './app/styles/index.css';

// @ts-expect-error - Vite env types
if (import.meta.env.DEV) {
  // @ts-expect-error - JS module
  import('./utils/memoryMonitor').then(({ logMemory }) => {
    logMemory();
    setInterval(logMemory, 30000);
  });
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

render(() => <App />, root);
