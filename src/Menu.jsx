import { Button, Form, Stack } from "react-bootstrap"
import { Lobby } from "./Lobby"
import { useEffect, useState } from "react"



export function Menu(props) {


  let socket = props.socket;

  const [option, setOption] = useState(1);


  const [messages, setMessages] = useState([]);
  const [msginput, setMsgInput] = useState('')


  const sendMessage = (e) => {
    e.preventDefault();

    socket.emit('send_message', msginput);
    setMsgInput('');
  }


  useEffect(() => {
    socket.on("messages", (data) => {
      console.log(data);
      setMessages(data);
    })
  }, [socket])



  let content = "";

  if (option === 1) {
    content = <Lobby socket={socket} setRoomID={props.setRoomID} roomID={props.roomID} players={props.players}/>
  }


  if (option === 3) {
    content = <div>
      <h3>Settings</h3>
      <p>(These affect local games and hosted matches.)</p>

      <Form>
        <Form.Label>Test</Form.Label>
        <Form.Check // prettier-ignore
          type="switch"
          label="Easy Mode (used links are ignored rather than eliminating the player.)"
        />

        <Form.Check // prettier-ignore
          type="switch"
          label="Random Starting Movie"
        />


      </Form>

    </div>
  }

  if (option === 4) {
    content = <div>
      <h3>Welcome to Movie battle!</h3> <p>In this game, players take turns naming movies that are linked by prominent cast or crew members. Movies can't be used twice, and links can only be used up to three times. If you make an invalid guess or fail to guess in time, you're out!</p>
      <h4>Lifelines</h4>
      <p>
        Everyone has three lifelines (one-use only):    skip = skips your turn.    info = displays cast & crew of current movie.    time = adds 30 seconds to the timer."  
      </p>

    </div>
  }

  
  return (
    <div className="movie-front-page">

        <div className="test">
          <div className="messages">
            {messages.map((msg) => {
              return (
              <p>{msg}</p>
              )
            })}
          </div>

          <form onSubmit={sendMessage}>
              <input name='msg' value={msginput} onChange={(e) => {setMsgInput(e.target.value)}}/>
              <Button type='submit' variant='primary'>Send</Button>
            </form>
        </div>

        <div className="movie-menu">

          <h1>Movie Battle</h1>

          <Stack gap={3} className="menu-options">
            <h3 onClick={() => {setOption(1)}}>Play Online</h3>
            <h3 onClick={() => {setOption(2)}}>Local Match</h3>
            <h4 onClick={() => {setOption(3)}}>Settings</h4>
            <h5 onClick={() => {setOption(4)}}>What's Movie Battle?</h5>
          </Stack>
        </div>
    
        <div className="movie-menu-selected">
          {content}
        </div>

        <div>
    
        </div>
        
    </div>
  )
}
