import React, { useState } from 'react'
import { AuthData } from '../../auth/AuthWrapper';

export const SignUp = () => {

    const { signUp } = AuthData();
    const [firstName, setfirstName] = useState('');
    const [lastName, setLastname] = useState('');
    const [age, setAge] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const registerSubmit = async () => {
        
        await signUp(username, password, firstName, lastName, age);

    };

    return (
        <div className='signUp'>
        <input
        placeholder='imię' 
        value={firstName}
        onChange={(e) => setfirstName(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='nazwisko' 
        value={lastName}
        onChange={(e) => setLastname(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='wiek'
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='login' 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        ></input>

        <br/>

        <input
        placeholder='hasło' 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        ></input>

        <br/>

        <button onClick={registerSubmit}>Zarejestruj się</button>

        </div>

    )
}