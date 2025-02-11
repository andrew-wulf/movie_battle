import { useEffect, useState } from "react";
import { BiSolidSkipNextCircle } from "react-icons/bi";
import { MdMovieEdit } from "react-icons/md";
import { RiTimerFlashLine } from "react-icons/ri";


export function Input(props) {

    const [searchCache, setSearchCache] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [inputVal, setInputVal] = useState("");

    let socket = props.socket;
    let roomData = props.roomData;
    let roomID = props.roomID;
    let myTurn = props.myTurn;


    const handleUpdate = (e) => {
        e.preventDefault();
        let val = e.target.value; 
        setInputVal(val);

        if (val.length < 1) {
            setSearchResults([])
            return
        }

        let cached = false;
        searchCache.forEach(arr => {
          if (arr[0] === val) {
            console.log(arr)
            setSearchResults(arr[1]);
            cached = true;
            //console.log('CACHE: ', arr[1])
          }
        })
    
        if (cached === false) {
            console.log(searchCache)
            if (val.length > 1 && searchCache.length > 0 && searchCache[searchCache.length - 1][1].length < 1) {
                setSearchCache(searchCache => [...searchCache, [val, []]])
            }
            else {
                socket.emit('input_update', val, roomID)
            }
        }
      }
    

    useEffect(() => {
        socket.on('recieve_input_update', (val, res) => {
        //console.log(val, res);
        setSearchCache(searchCache => [...searchCache, [val, res]])
        setSearchResults(res);
        })
    }, [socket])


    const submit = (arr) => {
        if (myTurn) {
            if (roomData.status === 'first_pick') {
                socket.emit('first_pick', roomID, arr)
            }
            else {
                socket.emit('input_submit', roomID, arr);
            }
        }
        setSearchResults([]);
        setInputVal("")
    }
    
    const useLifeline = (lifeline) => {
        console.log(2)
        socket.emit('lifeline', roomID, lifeline)
    }
    
    if (roomData) {
        if (searchResults) {
            return (
                <div className="w-[220px] sm:w-[500px] h-12 absolute left-1/2 -translate-x-1/2">

                    <div className="relative w-full h-full">
                        <div className="z-0 absolute bottom-10 flex flex-col gap-2 w-[220px] sm:w-[500px] text-black bg-[rgb(208,208,228)] text-lg rounded-t-xl overflow-hidden">
                            {
                                searchResults.map((obj, i) => {

                                    if (i < 8 || window.innerWidth >= 640) {
                                        return (
                                            <p className="w-full hover:cursor-pointer hover:bg-sky-100" 
                                                key={i}
                                                onClick={() => {submit(obj)}}
                                                >
                                                {`${obj.title} (${obj.release_date.substring(0,4)})`}
                                            </p>
                                        )
                                    }
                                })
                            }
                        </div>
            
            
                        <input className="z-10 w-[220px] sm:w-[500px] h-12 bg-[rgb(208,208,228)]/80 text-black rounded-xl text-center text-lg opacity-100 disabled:opacity-0 duration-500"
                            placeholder="Enter a movie title."
                            value={inputVal}
                            onChange={handleUpdate}
                            disabled={!myTurn}
                        >
                        </input>
        
                        <div className=" mt-4 flex flex-row gap-5 w-500px justify-center lg:justify-end"
                        hidden={!myTurn}
                        >
                            <button className="text-yellow-300/80 hover:text-yellow-300 disabled:opacity-40 disabled:hover:text-yellow-300/80 hover:cursor-pointer disabled:hover:cursor-default" 
                            disabled={!myTurn || !roomData.players[roomData.game_data.current_id].lifelines['time']} 
                            hidden={roomData.status ==='first_pick'} 
                            onClick={() => {useLifeline('time')}}
                            >
                                <RiTimerFlashLine  className="w-8 h-8 "/>
                            </button>
                            <button className="text-green-600/80 hover:text-green-500 disabled:opacity-40 disabled:hover:text-green-600/80 hover:cursor-pointer disabled:hover:cursor-default" 
                            disabled={!myTurn || !roomData.players[roomData.game_data.current_id].lifelines['skip'] || Object.keys(roomData.players).length < 2} 
                            hidden={roomData.status ==='first_pick'} 
                            onClick={() => {useLifeline('skip')}}
                            >
                                <BiSolidSkipNextCircle  className="w-8 h-8 "/>                  
                            </button>
                            <button className="text-gray-300/80 hover:text-white disabled:opacity-40 disabled:hover:text-gray-300/80 hover:cursor-pointer disabled:hover:cursor-default" 
                            disabled={!myTurn || !roomData.players[roomData.game_data.current_id].lifelines['info'] || (roomData.game_data.history.length > 0 && roomData.game_data.history[roomData.game_data.history.length - 1].show_info)} 
                            hidden={roomData.status ==='first_pick'} 
                            onClick={() => {useLifeline('info')}}
                            >
                                <MdMovieEdit  className="w-8 h-8 "/>               
                            </button>
                        </div>

                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="w-[220px] sm:w-[500px] h-12 relative bottom-24">
                    <input className="z-10 w-[220px] sm:w-[500px] h-12 bg-[rgb(208,208,228)]/80 text-black rounded-xl text-center text-lg opacity-100 disabled:opacity-0 duration-500"
                        placeholder="Enter a movie title."
                        value={inputVal}
                        onChange={handleUpdate}
                        disabled={!myTurn}
                    >
                    </input>
    
                    <div className="flex flex-row gap-4">
                        <RiTimerFlashLine />
                        <BiSolidSkipNextCircle />
                        <MdMovieEdit />
                    </div>
                </div>
            )
        }
    }

}


