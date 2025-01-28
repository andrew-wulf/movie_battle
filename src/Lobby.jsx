import { useEffect, useState } from "react";
import { Button, Container, Form, Stack } from "react-bootstrap";


export function Lobby(props) {

  const [lobbies, setLobbies] = useState({});


  let socket = props.socket;


  let roomID = props.roomID;
  let players = props.players;


  const createLobby = () => {
    socket.emit('create_lobby');
  }

  const refreshLobbies = () => {
    socket.emit('view_lobbies')
  }
  useEffect(refreshLobbies, []);


  const exitLobby = () => {
    socket.emit('exit_lobby')
  }

  const joinLobby = (code) => {
    socket.emit('join_lobby', code)
  }


  useEffect(() => {
    socket.on("lobbies_data", (data) => {
      setLobbies(data);
    })
  }, [socket])


  if (roomID) {
    return (
      <div className="movie-lobby">
        <div className="active-lobby">
          <h3>Lobby: {roomID}</h3>

          <h4>Players ({Object.keys(players).length}/8)</h4>
          <p>{Object.keys(players).map(id => {
            return (
              <div className="players-row" key={id}>
                <h4>{players[id].name}</h4>
              </div>
          )
          })}</p>
        </div>

        <div className="lobbies-footer">
          <Button variant='dark'>Start Match</Button>
          <Button  onClick={exitLobby} variant='dark'>Leave</Button>
          <br></br>
  
        </div>
      </div>

    )
  }

  else {
    return (
      <div className="absolute top-[460px] w-[350px] h-[380px] bg-gray-300 rounded-lg flex flex-col place-items-center text-black">
  
        <div className="lobbies">
          <h2>Lobbies</h2>
          {Object.keys(lobbies).map(key => {
            let players = lobbies[key];
            return (
              <div className="lobbies-row" key={key} onClick={() => {joinLobby(key)}}>
                <h4>Lobby {key}</h4>
                <h4>{Object.keys(players).length}/8</h4> 
              </div>
          )
          })}
  
        </div>
        
        <div className="lobbies-footer">
          <Button  onClick={createLobby} variant='dark'>Create Public Lobby</Button>
          <Button variant='dark'>Create Private Lobby</Button>
          <Stack>
            <Form.Group>
            
              <Form.Label>Lobby Code</Form.Label>
              <Form.Control />
            </Form.Group>
              <Button variant='success'>Connect</Button>
          </Stack>
  
  
          <br></br>
  
        </div>
  
  
      </div>
    )
  }


}


