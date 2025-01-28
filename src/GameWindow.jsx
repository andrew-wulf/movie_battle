import Form from 'react-bootstrap/Form';

import Stack from 'react-bootstrap/Stack';

import Button from 'react-bootstrap/Button';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { SearchResults } from './SearchResults';
import { Timer } from './Timer';



export function GameWindow(props) {

  


  const [inputVal, setInputVal] = useState("");
  const [activeTurn, setActiveTurn] = useState(true);
  const [activeTimer, setActiveTimer] = useState(true);


  const [gameText, setGameText] = useState("");

  const [searchCache, setSearchCache] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


  const [movies, setMovies] = useState([]);
  



  const handleSubmit = (movie) => {
    let full_title = `${movie.title} (${movie.release_date.substring(0, 4)})`;
    let output = {id: movie.id, title: full_title, data: []};

    setInputVal("");
    setSearchResults("");

    axios.post(`/movies/data/${movie.id}.json`)
        .then(response => {
          console.log(response);
          output.data = response.data;
          setMovies([...movies, output]);
          console.log(movies)
        })
        .catch(error => {
          console.log(error);
          setMovies([...movies, output]);
        });
  }
  

  const handleUpdate = (e) => {
    e.preventDefault();
    let val = e.target.value; 
    setInputVal(val);

    let cached = false;
    searchCache.forEach(arr => {
      if (arr[0] === val) {
        setSearchResults[arr[1]];
        cached = true;
        console.log('CACHE: ', arr[1])
      }
    })

    if (cached === false) {
      search(e.target.value);
    }
  }


  const search = (term) => {
    axios.post('/movies/search.json', {term: term})
        .then(response => {
          console.log(response);
          let data = response.data;
          let cache = searchCache;
          cache.push([term, data]);
          setSearchResults(data);
        })
        .catch(error => {
          console.log(error);
        });
  }

  const handleTimeout = () => {
    console.log("Time's up!")
    if (activeTimer) {
      setActiveTurn(false);
    }
  }

  
    return (

      <div className='movie-content'>
        
        <div className='response-area'>
          {/* {
            responses.map(response => {
              if (response.success) {
                return (
                  <div key={response.id}>
                    <h4>Link: {response.link}</h4>
                    <h6>{'X ' * response.uses}</h6>
                    <h2>{response.title}</h2>
                  </div>
                )
              }
              else {
                return (
                  <div key={response.id}>
                    <h2>Fail</h2>
                    <p>Guess: {response.title}</p>
                  </div>
                )
              }
            })
          } */}
          
          <h2>Movies</h2>
          <div className='movies'>
            {
              movies.map(movie => {
                if (movie.data) {
                  return (
                  <div key={movie.id} className='movie-row'>
                    <h5>{movie.title}</h5>
                    <p>Director: {movie.data.director}</p>
                    <p>Top Cast: {movie.data.cast.slice(0, 5).map(arr => {return(arr[0])}).join(', ')}</p>
                    </div>
                    )
                }
              })
            
            }
          </div>
        </div>

        
        <Timer secs={30} timeout={handleTimeout}/>
        

        <div className='input-area'>
          <Form.Group className="mb-3" >
            <Form.Label>Input:</Form.Label>
            <Form.Control type="text" name="movie" placeholder="Movies" value={inputVal} onChange={handleUpdate}/>
            <SearchResults results={searchResults} submit={handleSubmit}/>

            <Stack direction='horizontal' gap={3}>
              <Button className='lifeline-button'>Extra Time</Button>
              <Button className='lifeline-button'>Skip Turn</Button>
              <Button className='lifeline-button'>Movie Info</Button>
            </Stack>
          </Form.Group>
        </div>


      </div>
    )
}