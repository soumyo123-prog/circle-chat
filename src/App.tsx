import { useSocket } from './context/socket';
import Login from './screens/login/login';

function App() {
  const { socket } = useSocket();
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
