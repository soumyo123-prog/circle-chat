import Toast from './components/toast/toast';

import HomeUnauthenticated from './screens/home-unauthenticated/home-unauthenticated';

import { useAuth } from './context/auth';
import HomeAuthenticated from './screens/home-authenticated/home-authenticated';

function App() {
  const { user } = useAuth();
  return (
    <div>
      {!user ? <HomeUnauthenticated /> : <HomeAuthenticated />}
      <Toast />
    </div>
  );
}

export default App;
