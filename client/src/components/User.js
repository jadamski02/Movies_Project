import React, { useState } from 'react'
import axios from 'axios';

function User(props) {

  const [role, setRole ] = useState(props.role);


    const zwiekszUprawnienia = async () => {
      setRole('admin');
      try {
        await axios.post("http://localhost:5000/zwiekszUprawnienia", {
          login: props.login
        });
      } catch (error) {
        console.error(error);
      }
    };

    const odbierzUprawnienia = async () => {
      setRole('user');
      try {
        await axios.post("http://localhost:5000/odbierzUprawnienia", {
          login: props.login
        });
      } catch (error) {
        console.error(error);
      }
    };

    const zablokujKonto = async () => {
      setRole('blocked');
      try {
        await axios.post("http://localhost:5000/zablokujKonto", {
          login: props.login
        });
      } catch (error) {
        console.error(error);
      }
    };

    const odblokujKonto = async () => {
      setRole('user');
      try {
        await axios.post("http://localhost:5000/odblokujKonto", {
          login: props.login
        });
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div className='user' style={{ color: role === 'admin' ? 'orange' : 'white' }} key={props.id}><br/>
        {props.login} - {props.role} <br/>
        {role === 'user' || role === 'blocked' ? (
            <>
            <button onClick={zwiekszUprawnienia}>Zwiększ uprawnienia</button><> </>
            {role === 'blocked' ? (<button style={{ color: "green" }} onClick={odblokujKonto}>Odblokuj konto</button>
            ) : (
            <button style={{ color: "red" }} onClick={zablokujKonto}>Zablokuj konto</button>)
            }
            </>

        )  : (
        <>
            <button style={{ color: "red" }} onClick={odbierzUprawnienia} >Odbierz uprawnienia</button>
        </>) }
        </div>
  )
}

export default User