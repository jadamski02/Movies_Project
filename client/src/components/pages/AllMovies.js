import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Movie from '../Movie';

export const AllMovies = ({ logOut }) => {
    const [filmy, setFilmy] = useState([]);

    const pobierzFilmy = async () => {
        axios.get("http://localhost:5000/movies")
        .then((res) => {
            setFilmy(res.data);
        })
    }

    useEffect(() => {
        pobierzFilmy();
      }, [] );


  return (
   
    <div className='listaFilmow'>
        {filmy.map((film) => 
            <Movie key={film.id} id={film.id} title={film.title} year={film.year} length={film.length} image={film.image}/>
        )}
    </div>

  )
}

