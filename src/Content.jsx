import { useEffect, useState } from 'react';
import { Room } from './Room';



export function Content(props) {

  let socket = props.socket;
  let connected = props.connected;

  let [nameInput, setNameInput] = useState("");
  let [codeInput, setCodeInput] = useState("")


  const createLobby = () => {
    let id = localStorage.getItem('id');

    if (id) {
      socket.emit('update_name', nameInput);
      socket.emit('create_lobby');
    }
  }

  const joinLobby = () => {
    if (codeInput.length === 4) {
      window.location.href = `/room/${codeInput}`
    }
  }

  useEffect(() => {
    socket.on("create-lobby-success", (code) => {
      console.log('success: ', code)
      window.location.href = `/room/${code}`
    })
  }, [socket])


  let url = window.location.href;


  if (url.includes('/room')) {

    return (
      <>
        <Room socket={socket} connected={connected}/>
      </>
    )
  }

  else {
    return (
      <>
        <div className='absolute top-[120px] flex flex-col gap-2 w-[350px] h-[240px] bg-gray-200 rounded-xl text-black place-items-center'>
          <h1 className='text-xl tracking-loose mt-3 font-semibold'>
            Welcome to Movie Battle
          </h1>

          <p className='mt-5'>
            To create a room, choose a nickname.
          </p>

          <input className='w-48 h-10 rounded-2xl border border-gray-700 text-center  focus:border-sky-600 focus:outline focus:outline-sky-600' 
          placeholder='Enter your nickname' value={nameInput} onChange={(e) => {setNameInput(e.target.value)}} 
          onKeyDown={(e) => {if (e.key === 'Enter') {createLobby()}}}>
          </input>


          <button className='mt-4 mb-6 w-32 h-9 rounded-xl bg-[rgb(67,199,50)] shadow-sm shadow-gray-500 hover:cursor-pointer hover:bg-[rgb(47,179,30)]' 
          onClick={createLobby}
          >
            Create Room
          </button>
        </div>


        <div className='absolute top-[480px] flex flex-col gap-2 w-[350px] h-[240px] bg-gray-200 rounded-xl text-black place-items-center'>
          <h1 className='text-xl tracking-loose mt-3 font-semibold'>
            Join a Room
          </h1>

          <p className='mt-5'>
            To join a room, enter a room code.
          </p>

          <input className='w-48 h-10 rounded-2xl border border-gray-700 text-center  focus:border-sky-600 focus:outline focus:outline-sky-600' 
          placeholder='Enter room code' value={codeInput} onChange={(e) => {setCodeInput(e.target.value)}}
          onKeyDown={(e) => {if (e.key === 'Enter') {joinLobby()}}}
          >
          </input>


          <button className='mt-4 mb-6 w-32 h-9 rounded-xl bg-[rgb(67,199,50)] shadow-sm shadow-gray-500 hover:cursor-pointer hover:bg-[rgb(47,179,30)]' 
          onClick={joinLobby}
          >
            Connect
          </button>
        </div>


        <p 
        
        className='absolute bottom-[60px] text-xl text-gray-300'
        >
          This game is made possible by the API provided by <a className="text-sky-500 hover:text-sky-400" href={"https://developer.themoviedb.org/docs/getting-started"} target="_blank" >themoviedb.org!</a>
        </p>


      </>
    )
  }


  // if (name) {

  //   if (page === 1) {
  //     return (
  
  //       <Menu startGame={startGame} socket={socket} name={name} setRoomID={props.setRoomID} roomID={props.roomID} players={props.players}/>
  
  //     )
  //   }
  
  //   if (page === 2) {
  //     return (
  //       <GameWindow  socket={socket}/>
  //     )
  //   }
  // }
  // else {
  //   return (
  //     <Intro updateName={props.updateName}/>
  //   )
  // }
}