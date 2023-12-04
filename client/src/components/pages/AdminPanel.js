import { useState, useEffect, useRef } from 'react';
import User from "../User";
import Cookies from 'universal-cookie';
import axios from 'axios';
import FormData from 'form-data';
import MovieToDelete from '../MovieToDelete';

export const AdminPanel = () => {

    const inputRef = useRef(null);
    const cookies = new Cookies();
    const [userList, setUserList] = useState([]);
    const [moviesList, setMoviesList] = useState([]);
    const [moviesToDeleteIds, setMoviesToDeleteIds] = useState([]);
    const token = cookies.get("token");
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState(null);
    const [uploadError, setUploadError] = useState(null);
    const [deleteInfo, setDeleteInfo] = useState(null);
    const defaultForms = {
        title: "",
        length: "",
        year: ""
    };
    const [forms, setForms] = useState(defaultForms);

    const requestOptionsGet = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 
                   'Authorization':  `Bearer ${token}`}
    };

    const pobierzUserow = async () => {
        await fetch(`http://localhost:5000/users`, requestOptionsGet)
        .then(res => res.json())
        .then(res => {
            setUserList(res);
        })
    };

    const pobierzFilmy = async () => {
        await fetch(`http://localhost:5000/movies`, requestOptionsGet)
        .then(res => res.json())
        .then(res => {
            setMoviesList(res);
        })
    };

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name] : e.target.value
        })
    }

    const handleDelete = () => {
        if(moviesToDeleteIds.length < 1) {
            return;
        }
        console.log(moviesToDeleteIds)
        axios.delete(`http://localhost:5000/deleteMovies`, { 
            headers: {
                Authorization: token
            },
            data: {
                Source: moviesToDeleteIds
            }
         })
        .then((res) => {
            console.log(res);
            pobierzFilmy();
            setDeleteInfo("Usunięto filmy z bazy");
        }).catch((err) => {
            console.log(err);
        });
        setMoviesToDeleteIds([]);
        setTimeout(() => {
            setDeleteInfo("")
        }, 2000)
    
    }

    const handleFileUpload = (event) => {
        setSelectedFile(event.target.files[0]);
      };

    const handleUpload =  () => {
        if(forms.title === '' || forms.year === '' || forms.length === '') {
            setUploadError("Nie podano wszystkich informacji");
            setTimeout(() => {
                setUploadError('')}, 2000);
            return;
        }
        if(selectedFile === null) {
            setUploadError("Nie załączono pliku");
            setTimeout(() => {
                setUploadError('')}, 2000);
            return;
        }
        let data = new FormData();
        data.append('image', selectedFile);
        data.append('title', forms.title);
        data.append('length', forms.length);
        data.append('year', forms.year);
        // setUploadMessage("");
        axios.post('http://localhost:5000/upload', data, {
            headers: {
              'accept': 'application/json',
              'Content-Type': `multipart/form-data; boundary=${data.boundary}`,
            }
          })
            .then((response) => {
              setUploadMessage("Film został dodany");
              setForms(defaultForms);
              setSelectedFile(null);
              inputRef.current.value = null;
            }).catch((error) => {
              console.log("Bląd: ", error);
              setUploadError("Błąd podczas dodawania filmu")
            });
            setTimeout(() => {
                setUploadMessage('')}, 2000);
                pobierzFilmy();
    };

    useEffect(() => {
        pobierzUserow();
        pobierzFilmy();
    }, []);

     return (
          <div className="page">
               <h2>Admin panel</h2>
                <div className="userList">
                    <h2>Edycja użytkowników</h2>
                    {userList.map((user) => 
                        <User key={user.login} login={user.login} role={user.role}/>
                    )}
                </div>


                <div className='dodawanieFilmow'>
                    <h2>Nowy film</h2>
                    <input value={forms.title} name="title" placeholder = "Tytuł..." type="text" onChange={handleChange}/><br/>
                    <input value={forms.year} name="year" placeholder = "Rok produkcji..." type="number" onChange={handleChange}/><br/>
                    <input value={forms.length} name="length" placeholder = "Długość (min)" type="number" onChange={handleChange}/><br/>
                    <input ref={inputRef} name="image" type="file" onChange={handleFileUpload}/><br/>
                    <button onClick={handleUpload}>Dodaj</button><br/>
                    <div style={{ color: "green" }}>{uploadMessage}</div>
                    <div style={{ color: "red" }}>{uploadError}</div>
                </div>

                <div className='usuwanieFilmow'>
                    <h2>Usuń filmy</h2>
                        {moviesList.map((movie) => 

                            <MovieToDelete 
                            key={movie.id} 
                            id={movie.id} 
                            title={movie.title} 
                            moviesToDeleteIds={moviesToDeleteIds} 
                            setMoviesToDeleteIds={setMoviesToDeleteIds} />
                        )}
                        <button onClick={handleDelete}>Usuń zaznaczone</button>
                        <div style={{ color: "red" }}>{deleteInfo}</div>
                </div>
            </div>

     )
}