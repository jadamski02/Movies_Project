import React from 'react';

function Film(props) {

  return (
        <div className='film' key={props.id}>
            {props.image && (
            <img src={`data:image/jpg;base64,${props.image}`} alt="Plakat" />
            )}
            <br/><br/>
            {props.title}<br/>
            {props.year}<br/>
            {props.length} min.
        </div>
  )
}

export default Film