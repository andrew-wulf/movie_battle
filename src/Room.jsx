import { useEffect, useState } from "react";
import { IoIosSend } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { GameWindow } from "./GameWindow";
import { Game } from "./Game";
import { FaRegCopy } from "react-icons/fa";




export function Room (props) {

    const [roomData, setRoomData] = useState(null);
    const [hasJoined, setHasJoined] = useState(false);
    const [nameInput, setNameInput] = useState("");

    const [msgInput, setMsgInput] = useState("");
    const [msgCollapse, setMsgCollapse] = useState(true);
    const [playerCollapse, setPlayerCollapse] = useState(true);


    let socket = props.socket;
    let connected = props.connected;

    let url = window.location.href;
    let roomID = window.location.href.substring(url.lastIndexOf('/') + 1, url.length);

    let testData = { players: {
        'id1': {name: 'Tim'},
        'id2': {name: 'Rachel'},
        'id3': {name: 'Julie'},
        'id4': {name: 'drew'},
        'id5': {name: 'kiweenie'},
        },
        messages: [
            ['id1', "Let’s go, team! We got this! 💪"],
            ['id2', "Ugh, I totally knew that one! 😭"],
            ['id3', "What’s the answer to this? Anyone know? 🤔"],
            ['id4', "Shoutout to the leaderboard champs! 🔥"],
            ['id5', "That question was so tricky, wow! 😅"],
            ['id1', "Finally got one right! 🎉"],
            ['id3', "I feel like the timer is going faster. Anyone else? ⏱️"],
            ['id2', "How did I not know that?! 🤦‍♂️"],
            ['id4', "This is so fun! Good luck, everyone! 🙌"],
            ['id5', "The host is killing it tonight! 😂"],
            ['id1', "Does anyone remember who won last week? 🤓"],
            ['id3', "Okay, I’m calling it—I’m winning the next round! 😎"],
          ]
    }

    useEffect(() => {
        if (connected) {
            console.log(roomID)
            socket.emit('room_status', roomID)
            console.log('fetching room status...')
        }
    }, [socket, connected, roomID])



    useEffect(() => {
        socket.on('room_status', (data) => {
          console.log('room status: ', data)
          if (data) {
            setRoomData(data);
            socket.emit('join_channel', roomID);

            let id = localStorage.getItem('id');
            if (Object.keys(data.players).includes(id)) {
                console.log('already in room.')
                setHasJoined(true)
            }
            else {
                setHasJoined(false);   
            }
          }
        });


        socket.on('room_update', (data) => {
            setRoomData(data);
            console.log('update: ', data)
        })
      }, [socket])
    


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

    let playerStyle = "absolute flex flex-col place-items-center left-10 top-32 w-64 bg-black/65 text-gray-500 rounded-xl overflow-hidden duration-600"

    if (!playerCollapse) {
        playerStyle = "absolute flex flex-col place-items-center left-10 top-32 w-64 h-20 bg-black/65 text-gray-500 rounded-xl overflow-hidden duration-600"
    }
 
    

    if (roomData) {
        console.log(roomData)
        if (hasJoined) {
            
            return (
                <div className="w-full h-full relative flex flex-col place-items-center">
                    <div className={playerStyle}>

                        <div className="px-12 pb-1 w-full flex flex-row place-items-center justify-between">
                            <h1 className="mx-auto text-2xl pt-4 text-gray-300 w-full text-center">Players</h1>
                            <button className="mt-4 ml-auto w-10 h-10 rounded-md place-items-center text-gray-200 border border-gray-700 hover:cursor-pointer hover:bg-gray-700"
                                onClick={() => {setPlayerCollapse(!playerCollapse)}}
                            >
                                <MdOutlineKeyboardArrowDown className="w-6 h-6"/>
                            </button>
                        </div>
                        {
                            Object.keys(roomData.players).map(id => {
                                if (id === 'id3') {
                                    return (
                                        <div key={id} className="p-3 pl-10 w-full border-b border-gray-700/15">
                                            <p className="text-3xl font-semibold text-green-300">
                                                {roomData.players[id].name}
                                            </p>
                                        </div>
                                    )
                                }

                                else {
                                    return (
                                        <div key={id} className="p-3 pl-10 w-full border-b border-gray-700/15">
                                            <p className="text-3xl font-semibold">
                                                {roomData.players[id].name}
                                            </p>
                                        </div>
                                    )
                                }
                                
                            })
                        }
                    </div>

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
                                    if (msg.length > 0 && msg.length < 200) {
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


                    <div className='mt-10 ml-25 mr-auto flex flex-row gap-2 hover:cursor-pointer hover:text-gray-200 text-gray-400 place-items-center' 
                        onClick={() => {navigator.clipboard.writeText(url); alert('copied invite link to clipboard.')}}
                        >
                        <FaRegCopy/>
                        <h1 className="text-xl font-semibold tracking-tight">invite link</h1>
                    </div>



                    <Game roomData={roomData} socket={socket} roomId={roomID}/>
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
        return (
            <div>
                Loading
            </div>
        )
    }
}