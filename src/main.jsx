import { render } from 'solid-js/web';
import App from './App';
import './global.css';

// Memory monitoring in dev
if (import.meta.env.DEV) {
  import('./utils/memoryMonitor').then(({ logMemory }) => {
    logMemory('App Start');
    
    // Log memory on route changes
    window.addEventListener('popstate', () => logMemory('Route Change'));
  });
}

render(() => <App />, document.getElementById('root'));
