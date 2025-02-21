import './index.css'
import io from "socket.io-client"

import { Content } from './Content';


import { useEffect, useState } from 'react';
import { RiTimerFlashLine } from 'react-icons/ri';
import { BiSolidSkipNextCircle } from 'react-icons/bi';
import { MdMovieEdit } from 'react-icons/md';

let mode = process.env.NODE_ENV
let connectUrl = mode === "development" ? "http://localhost:4000" : "https://movie-battle-server-2ff362fad49d.herokuapp.com"

const socket = io.connect(connectUrl, {
  autoConnect: false
});

export function MovieBattle() {

  const [connected, setConnected] = useState(false);
  const [connectFail, setConnectFail] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



  const connect = () => {
    let storageID = localStorage.getItem("id");
    if (storageID) {
      //console.log('Storage ID detected: ', storageID)
    }

    //console.log('connecting...')
    socket.connect();
    //console.log(socket)

    if (socket.connected === false) {
      setConnectFail(true);
    }
  }
  
  useEffect(connect, []);
  


  useEffect(() => {

    socket.on('login', () => {
      let storageID = localStorage.getItem('id');
      let nickname = localStorage.getItem('nickname');
      //console.log('attempting to login as ', storageID)
      socket.emit('login', storageID, nickname)
    })
    socket.on("connected", () => {
        setConnected(true);
    })

    socket.on("setStorageID", (id) => {
      localStorage.setItem('id', id);
      console.log(`set local storage id: ${id}`)
    })

    socket.on("app_data", (data) => {
      console.log(data)
    })

    socket.on("reset", () => {
      window.location.href = "/"
    })

  }, [socket])


  const appData = () => {
    console.log('retrieving app data...')
    socket.emit('app_data')
  }

  const test = () => {
    socket.emit('test')
  }

  return (
    <div className='relative w-[100vw] h-[100vh] flex justify-center'>

      <div className="absolute inset-0 transition-all -z-10 bg-radial-[at_50%_50%] from-[rgb(60,71,231)] to-[rgb(2,7,72)]">
      </div>
      <div className="bg-auto absolute inset-0 -z-10 mix-blend-overlay bg-[rgb(61,62,87)]">
      </div>

    

      <HelpModal show={modalVisible} setVisible={setModalVisible}/>

      <Content socket={socket} connected={connected} setModalVisible={setModalVisible}/>
    </div>
  )
  
}


function HelpModal (props) {

  if (props.show) {

    return (
      <div className='z-30 absolute w-full h-full bg-black/20'
        onClick={() => {props.setVisible(false)}}
      >
        <div className='relative overflow-hidden rounded-2xl mt-10 mx-auto z-40 w-[320px] sm:w-[400px] lg:w-[800px] h-[800px]'
          onClick={(e) => {e.stopPropagation();}}
        >
            <button className='absolute top-4 right-4 w-12 h-12 rounded-full text-xl font-semibold text-gray-800 hover:cursor-pointer hover:bg-gray-400 hover:text-black'
              onClick={() => {props.setVisible(false)}}
            >
              &#x2715;
            </button>

          <div className='bg-gray-300 text-3xl flex flex-col place-items-center gap-4 h-full overflow-y-auto pb-8'>


            <h1 className='text-3xl font-semibold mt-6'>How to Play</h1>

            <p className='text-xl w-[300px] sm:w-[360px] lg:w-[580px] text-center text-gray-900 leading-8'>Once a starting movie is picked, players take turns
              entering <b className='text-gray-800'>movie titles</b> that are <b className='text-gray-800'>linked</b> via sharing cast or crew members.<br/><br/>
              Movie titles can never be used twice, and if a given movie doesn't share at least one cast or crew member with the previous title, or 
              the timer runs out, the player who entered it gets <b className='text-gray-800'>eliminated.</b> The 
              last player standing wins the round!</p>

            <h1 className='text-2xl mb-4 font-semibold mt-10'>Used Links</h1>

            <p className='text-xl w-[300px] sm:w-[360px] lg:w-[580px] text-center text-gray-900 leading-8'>Individual actors, directors, writers etc. can only be used as a link up 
              to <b className='text-gray-800'>three times.</b> After three uses, they're <b className='text-gray-800'>blacklisted </b>and won't be considered. 
              If hard mode is activated, picking a movie that contains a blacklisted cast/crew member results in elimination. If bans are turned on, players can make one ban each before the match starts.</p>

            <h1 className='text-2xl mb-4 font-semibold mt-10'>Lifelines</h1>
            <p className='text-xl w-[300px] sm:w-[360px] lg:w-[580px] text-center text-gray-900 leading-8'>
              There are three single-use lifelines that players can use if lifelines are enabled in 
              options:
            </p>
            
            <div className='flex flex-col gap-6 text-xl w-[300px] sm:w-[360px] lg:w-[580px] place-items-center'>
              <div className='flex gap-6'>
                <RiTimerFlashLine  className="w-8 h-8 mr-auto mt-1"/>
                <p className='mr-auto max-w-[280px] lg:max-w-[320px]'>Increases the timer duration by 50%.</p>
              </div>

              <div className='flex gap-6'>
                <BiSolidSkipNextCircle  className="w-8 h-8 mr-auto mt-1"/>
                <p className='mr-auto max-w-[280px] lg:max-w-[320px]'>Skips your turn. (If the last two players skip back-to-back, game ends in a tie.)</p>
              </div>

              <div className='flex gap-6'>
                <MdMovieEdit  className="w-8 h-8 mr-auto mt-1"/>
                <p className='mr-auto max-w-[280px] lg:max-w-[320px]'>Lists cast and crew for the current movie.</p>
              </div>
            </div>

          </div>

        </div>
  
      </div>
    )

  }

}