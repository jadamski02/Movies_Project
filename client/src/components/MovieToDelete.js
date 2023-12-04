import React from 'react'

function MovieToDelete({id, title, moviesToDeleteIds, setMoviesToDeleteIds}) {

    const handleChange = (e) => {
        if(e.target.checked) {
            setMoviesToDeleteIds([...moviesToDeleteIds, e.target.id]);
        } else {
            setMoviesToDeleteIds([...moviesToDeleteIds].filter(el => el != e.target.id));
        }

    }

  return (
    <div className='movieToDelete'>
        <input id={id} type="checkbox" onChange={handleChange}></input>
        {id} - {title} 
    </div>
  )
}

export default MovieToDelete