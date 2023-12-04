import React, { useState } from 'react'
import { AuthData } from '../../auth/AuthWrapper';

export const Login = () => {

    const { login } = AuthData();
    const { loginMessage } = AuthData();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async() => {

            await login(username, password);

    }

  return (
    <div className='login'>
        <input
        placeholder='username' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='hasło' 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        ></input>

        <br/>

        <button onClick={handleLogin}>Zaloguj się</button><br/>

        Nie masz konta? <a href='rejestracja'>Zarejestruj się</a><br/>

        <div className='loginMessage'>{loginMessage}</div>

    </div>
  )
}

