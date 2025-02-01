import './index.css'
import io from "socket.io-client"

import { Content } from './Content';


import { useEffect, useState } from 'react';


const socket = io.connect("http://localhost:4000", {
  autoConnect: false
});


export function MovieBattle() {

  const [connected, setConnected] = useState(false);
  const [connectFail, setConnectFail] = useState(false);

  const connect = () => {
    let storageID = localStorage.getItem("id");
    if (storageID) {
      console.log('Storage ID detected: ', storageID)
    }

    console.log('connecting...')
    socket.connect();
    console.log(socket)

    if (socket.connected === false) {
      setConnectFail(true);
    }
  }
  
  useEffect(connect, []);
  


  useEffect(() => {

    socket.on('login', () => {
      let storageID = localStorage.getItem('id');
      let nickname = localStorage.getItem('nickname');
      console.log('attempting to login as ', storageID)
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

      <Content socket={socket} connected={connected}/>
    </div>
  )
  
}
