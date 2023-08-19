
import { AuthenticatedUserProvider } from './src/context/AuthContext';
import AppNavigation from './src/navigation';

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <AppNavigation />

    </AuthenticatedUserProvider>
  );
}


