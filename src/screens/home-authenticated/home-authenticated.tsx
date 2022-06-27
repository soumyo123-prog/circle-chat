import { useAuth } from '../../context/auth';

export default function HomeAuthenticated() {
  const { logout } = useAuth();
  return <button onClick={logout}>Logout</button>;
}
