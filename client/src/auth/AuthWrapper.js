import { createContext, useContext, useEffect, useState } from 'react';
import { RenderHeader } from '../components/structure/Header';
import { RenderMenu, RenderRoutes } from '../components/structure/RenderNavigation';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'universal-cookie';

const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {

    const navigate = useNavigate();
    const cookies = new Cookies();
    const [ user, setUser ] = useState({ username: "", firstName: "", lastName: "", role_id: -1, isAuthenticated: false });
    const [ loginMessage, setLoginMessage ] = useState(null);

    const checkLoginStatus = async () => {
        const token = cookies.get("token")
        if(token === undefined) return;

        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: cookies.get("token") })
      };
    
        axios.post("http://localhost:5000/checkLoginStatus", {
        token
        })
        .then((res) => {
            if(res.status === 200) {
            const { username, token, firstName, lastName, role_id } = res.data;
            setUser({username, firstName, lastName, role_id, isAuthenticated: true})
            }
        })
        .catch((error) => {
            if (error.response && error.response.status === 403) {
                console.error('doopa');
            } else if(error.response && error.response.status === 401){
                console.error('Niepoprawne dane - 401');
            } else {
                console.error('Error:', error);
            }
        });
    
      }

    useEffect(() => {
        checkLoginStatus();
    }, [])

    const login = async (username, password) => {
        setLoginMessage('');
      if(username.length === 0) setLoginMessage("Proszę podać poprawny login");
      if(password.length === 0) setLoginMessage("Proszę podać poprawne hasło");
      axios.post("http://localhost:5000/login", {
        username,
        password,
      })
      .then((res) => {
        if(res.status === 200) {
          const { username, token, firstName, lastName, role_id } = res.data;
          cookies.set("token", token);
          setUser({username, firstName, lastName, role_id, isAuthenticated: true})
          navigate('account');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
            console.error('Forbidden error: Access Denied');
            setLoginMessage("Użytkownik zablokowany")
        } else if(error.response && error.response.status === 401){
            console.error('Niepoprawne dane - 401');
            setLoginMessage("Niepoprawne dane")
        } else {
            console.error('Error:', error);
        }
      });
        
    }

    const signUp = async(username, password, firstName, lastName, age) => {
        axios.post("http://localhost:5000/signUp", {
        username,
        password,
        firstName,
        lastName,
        age
      }).then((res) => {
        if(res.status === 200) {
          const { username, token, firstName, lastName, role_id } = res.data;
          cookies.set("token", token);
          setUser({username, firstName, lastName, role_id, isAuthenticated: true})
          navigate('account');
        }
      })
    }

    const logout = () => {
        setUser({ ...user, isAuthenticated: false });
        cookies.remove("token");
    }

    return (

        <AuthContext.Provider value={{ user, login, signUp, logout, loginMessage }}>
            <>
                <RenderHeader />
                <RenderMenu />
                <RenderRoutes />

            </>
        </AuthContext.Provider>

    )
}