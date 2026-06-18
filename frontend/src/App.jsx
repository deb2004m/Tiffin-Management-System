import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';
import Toast from './components/common/Toast';

function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
          <Toast />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

export default App;
