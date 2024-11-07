import { Router } from './router';
import { ToastProvider } from '@/components/ui/toast';

function App() {
  return (
    <ToastProvider>
      <Router />
    </ToastProvider>
  );
}

export default App;
