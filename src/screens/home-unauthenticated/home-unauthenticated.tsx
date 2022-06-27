import { useState } from 'react';
import Register from '../../components/register/register';
import Login from '../../components/login/login';

export enum Choosen {
  Register,
  Login
}

export default function HomeUnauthenticated() {
  const [email, setEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [option, setOption] = useState(Choosen.Register);

  if (option === Choosen.Register) {
    return (
      <Register
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        username={username}
        setUsername={setUsername}
        setOption={setOption}
      />
    );
  }
  return (
    <Login
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      setOption={setOption}
    />
  );
}
