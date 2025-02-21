import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GameWindow } from "./GameWindow";
import { Game } from "./Game";
import { FaRegCopy } from "react-icons/fa";
import { GameOverModal } from "./GameOverModal";
import { Timer } from "./Timer";




export function Room (props) {

    const [roomData, setRoomData] = useState(null);
    const [roomExists, setRoomExists] = useState(true);
    const [hasJoined, setHasJoined] = useState(false);
    const [nameInput, setNameInput] = useState("");
    const [readyCount, setReadyCount] = useState(0);

    const [msgInput, setMsgInput] = useState("");
    const [msgCollapse, setMsgCollapse] = useState(true);
    const [playerCollapse, setPlayerCollapse] = useState(true);

    const [myTurn, setMyTurn] = useState(false);

    const [timerDuration, setTimerDuration] = useState(0);
    const [timerRemaining, setTimerRemaining] = useState(0);
    const [timerKey, setTimerKey] = useState(10000);

    const [test, setTest] = useState(false)

    let socket = props.socket;
    let connected = props.connected;

    let url = window.location.href;
    let roomID = window.location.href.substring(url.lastIndexOf('/') + 1, url.length);


    useEffect(() => {
        if (connected) {
            //console.log(roomID)
            socket.emit('room_status', roomID)
            //console.log('fetching room status...')
        }
    }, [socket, connected, roomID])



    useEffect(() => {
        socket.on('room_update', (data) => {
            //console.log('update: ', data)
            if (data) {
                setRoomExists(true)
                setRoomData(data);
                socket.emit('join_channel', roomID);

                let id = localStorage.getItem('id');
                if (Object.keys(data.players).includes(id)) {
                    setHasJoined(true)
                }
                else {
                    console.log("Haven't joined the room yet.")
                    setHasJoined(false);   
                }

                if (data.game_data) {
                    if (data.game_data.current_id === localStorage.getItem('id') && data.game_data.running) {
                        setMyTurn(true);
                    }
                    else {
                        setMyTurn(false);
                    }
                }
                if (data.timer) {
                    setTimerDuration(data.timer.duration);
                    setTimerRemaining(data.timer.remaining);
                }
                else {
                    setMyTurn(false);
                }
            }
            else {
                setRoomExists(false)
            }

        })
      }, [socket])


    useEffect(() => {
        if (timerRemaining === timerDuration && timerRemaining > 0) {
            setTimerKey(timerKey + 1);
        }
    }, [timerRemaining, timerDuration]);


    useEffect(() => {
        if (roomData) {
            if (roomData.status === 'pre-game' || roomData.status === 'finished') {
                let count = 0;
                Object.keys(roomData.players).forEach(key => {
                    if (roomData.players[key].ready) {
                        count++;
                    }
                })
                setReadyCount(count);
            }
        }
    }, [roomData])


    const joinLobby = () => {
        socket.emit('update_name', nameInput);
        socket.emit('join_lobby', roomID);
        socket.emit('join_channel', roomID);
        socket.emit('room_status', roomID);
    }

    const postMsg = () => {
        if (msgInput.length > 0 && msgInput.length < 200) {
            socket.emit('post_message', msgInput, roomID)
            setMsgInput("");
        }
    }



    let msgStyle = "absolute flex flex-col place-items-center right-10 bottom-32 w-96 h-[600px] overflow-hidden bg-black/65 text-gray-500 rounded-xl duration-800"

    if (!msgCollapse) {
        msgStyle = "absolute flex flex-col place-items-center right-10 bottom-32 w-96 h-[140px] overflow-hidden bg-black/65 text-gray-500 rounded-xl duration-800"
    }

    let playerStyle = "absolute flex flex-row flex-grow lg:flex-col w-full lg:w-auto place-items-center left-0 lg:left-6 bottom-0 lg:bottom-12 lg:bottom-auto lg:left-10 lg:top-32 w-64 bg-black/65 text-gray-500 rounded-xl overflow-hidden duration-600"

    if (!playerCollapse) {
        playerStyle = "absolute flex flex-row lg:flex-col w-full lg:w-auto place-items-center left-0 lg:left-6 bottom-0 lg:bottom-12 lg:bottom-auto lg:left-10 lg:top-32 w-64 h-18 bg-black/65 text-gray-500 rounded-xl overflow-hidden duration-600"
    }
 
    

    if (roomData) {
        if (hasJoined) {
            
            return (
                <div className="w-full h-full relative flex flex-col place-items-center overflow-hidden">

                    <button className='z-30 absolute top-3 lg:top-5 right-3 lg:right-10 w-32 h-12 bg-black/50 text-gray-300 rounded-xl hover:cursor-pointer hover:bg-black/70 hover:shadow hover:shadow-blue-800 text-lg font-semibold'
                        onClick={() => {props.setModalVisible(true)}}
                        hidden={window.innerWidth < 700 && !['pre-game', 'finished'].includes(roomData.status)}
                        >
                        How to Play
                    </button>

                    <div className={playerStyle}>

                        <div className="hidden lg:flex pr-6 pb-1 w-full flex-row place-items-center justify-between">
                            <h1 className="mx-auto text-2xl pt-4 pl-4 text-gray-300 w-full text-center">Players ({Object.keys(roomData.players).length}/8)</h1>
                            <button className="mt-4 ml-2 w-10 h-10 rounded-md place-items-center text-gray-200 border border-gray-700 hover:cursor-pointer hover:bg-gray-700"
                                onClick={() => {setPlayerCollapse(!playerCollapse)}}
                            >
                                <MdOutlineKeyboardArrowDown className="w-6 h-6"/>
                            </button>
                        </div>
                        {
                            Object.keys(roomData.players).map(id => {

                                let statusStyle = "hidden font-semibold text-green-700";
                                let nameStyle = "font-semibold text-gray-500";

                                if (roomData.players[id].ready && roomData.status !== "active") {
                                    statusStyle = "font-semibold text-green-700"
                                    nameStyle = "font-semibold text-sky-300"
                                }

                                if (roomData.status === 'active' || roomData.status === 'first_pick') {

                                    if (id === roomData.game_data.current_id) {
                                        nameStyle = "font-semibold text-green-300"
                                    }
                                    else {
                                        if (roomData.players[id].active === false) {
                                            nameStyle = "font-semibold text-gray-600/80 line-through"
                                        }
                                        else {
                                            nameStyle = "font-semibold text-gray-300/90"
                                        }
                                    }
                                }
                                    

                            
                                return (
                                    <div key={id} className="p-3 lg:pl-10 lg:w-full text-md sm:text-xl md:text-2xl lg:text-3xl border-r lg:border-b border-gray-700/15 lg:flex flex-row gap-10 place-items-center">
                                        <p className={nameStyle}>
                                            {(roomData.players[id].name)}
                                        </p>
                                    </div>
                                )
                                
                            })
                        }
                    </div>
                    
                    <div className="hidden xl:block">
                        <div className={msgStyle}>
                            <div className="px-12 pb-1 w-full flex flex-row place-items-center justify-between">
                                <h1 className="mx-auto text-2xl pt-4 text-gray-300 w-full text-center">Chat</h1>
                                <button className="mt-4 ml-auto w-10 h-10 rounded-md place-items-center text-gray-200 border border-gray-700 hover:cursor-pointer hover:bg-gray-700"
                                    onClick={() => {setMsgCollapse(!msgCollapse)}}
                                >
                                    <MdOutlineKeyboardArrowDown className="w-6 h-6"/>
                                </button>
                            </div>
                            
                            <div className="relative w-full h-full overflow-hidden">
                                <div className="absolute w-full bottom-0 duration-600">
                                    {
                                        roomData.messages.map((msg, i) => {
                                        
                                            return (
                                                <div key={i} className="p-3 pl-10 text-wrap w-80 border-gray-700/15">
                                                    <div>
                                                        <h1 className="text-[rgb(136,148,226)]">
                                                            {roomData.players[msg[0]].name}
                                                        </h1>
                                                        <p className="text-lg font-semibold text-sky-600">
                                                            {msg[1]}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                                    
                            <div className="flex flex-row items-center justify-between w-full px-10 pb-4 pt-4">
                                <input className="mx-auto w-60 h-10 focus:bg-gray-600/10 text-sky-600 border border-gray-700/50 rounded-xl text-center"
                                    placeholder="type here to chat."
                                    value={msgInput}
                                    onChange={(e) => {
                                        let msg = e.target.value;
                                        if (msg.length > -1 && msg.length < 200) {
                                            setMsgInput(e.target.value)
                                        }
                                    }}
                                    onKeyDown={(e) => {if (e.key === 'Enter') {postMsg()}}}
                                >
                                </input>
                                <button className="ml-auto w-10 h-10 rounded-md place-items-center text-gray-200 border border-gray-700 hover:cursor-pointer hover:bg-gray-700"
                                    onClick={postMsg}
                                >
                                    <IoIosSend className="w-6 h-6"/>
                                </button>
                            </div>
                        </div>

                    </div>


                    <div className='fixed top-6 left-6 lg:top-10 lg:left-25 flex flex-row gap-2 hover:cursor-pointer hover:text-gray-200 text-gray-400 place-items-center' 
                        onClick={() => {navigator.clipboard.writeText(url); alert('copied invite link to clipboard.')}}
                        hidden={window.innerWidth < 700 && !['pre-game', 'finished'].includes(roomData.status)}
                        >
                        <FaRegCopy/>
                        <h1 className="text-xl font-semibold tracking-tight">invite link</h1>
                    </div>



                    <Game roomData={roomData} socket={socket} roomID={roomID} myTurn={myTurn} duration={timerDuration} remaining={timerRemaining} setRemaining={setTimerRemaining} timerKey={timerKey} readyCount={readyCount}/>
                    {/* <button className='fixed left-40 bottom-20 bg-black text-white rounded-lg w-20 h-10 hover:cursor-pointer z-100' onClick={() => {setTest(!test)}}>Test</button> */}
                    <GameOverModal show={roomData.status === 'finished' ? true : false} socket={socket} roomID={roomID} roomData={roomData} readyCount={readyCount}/>

                </div>
            )
        }

        else {
            return (
                <>
                    <div className='absolute top-[140px] flex flex-col gap-2 w-[350px] h-[240px] bg-gray-200 rounded-xl text-black place-items-center'>
                        <h1 className='text-xl tracking-loose mt-3 font-semibold'>
                            Welcome to Movie Battle
                        </h1>

                        <p className='mt-5'>
                            To join this room, choose a nickname.
                        </p>

                        <input className='w-48 h-10 rounded-2xl border border-gray-700 text-center  focus:border-sky-600 focus:outline focus:outline-sky-600' 
                            placeholder='Enter your nickname' 
                            value={nameInput} onChange={(e) => {setNameInput(e.target.value)}}
                            
                            onKeyDown={(e) => {if (e.key === 'Enter') {joinLobby()}}}
                            >
                        </input>


                        <button className=' mt-4 mb-6 w-32 h-9 rounded-xl bg-[rgb(67,199,50)] shadow-sm shadow-gray-500 hover:cursor-pointer hover:bg-[rgb(47,179,30)]' 
                            onClick={joinLobby}
                            >
                            Join Room
                        </button>
                    </div>
                </>
            )
        }
    }

    else {
        if (roomExists) {
            return (
                <div>
                    <p className="absolute text-xl top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-gray-100/70">
                        connecting...
                    </p>
                </div>
            )
        }
        else {
            window.location.href = '/'
        }
    }
}



