import { Router } from './router';
import { ToastProvider } from '@/components/ui/toast';
import { ThemeProvider } from './shared/components/ui/themeDark/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <ToastProvider>
        <Router />
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
