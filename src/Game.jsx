import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Timer } from "./Timer";

export function Game (props) {


    const [lifelines, setLifelines] = useState(true);
    const [banOption, setBanOption] = useState(false);
    const[hardMode, setHardMode] = useState(false);
    const[randomStart, setRandomStart] = useState(false);


    let roomData = props.roomData;
    let socket = props.socket;
    let roomID = props.roomID;
    let myTurn = props.myTurn;

    let gameData = roomData.game_data;


    
    // useEffect(() => {
    //     socket.on('timer_status', (timer) => {
    //         console.log(2)
    //         setCurrentTimer(<div className="absolute left-[200px] bottom-[200px]">
    //                             <Timer duration={timer.duration} remaining={timer.remaining}/>
    //                         </div>)
    //         })
    //     socket.on('room_update', (data) => {
    //         console.log(3)
    //         if (data.game_data && data.status === 'active' && data.timer) {
    //             setCurrentTimer(<div className="absolute left-[200px] bottom-[200px]">
    //                                 <Timer duration={data.timer.duration} remaining={data.timer.remaining}/>
    //                             </div>)
    //         }
    //     })
    // }, [socket])


    const startMatch = () => {
        socket.emit('start_match', roomID)
    }
    

    if (roomData.status !== 'active' && roomData.status !== 'finished') {

        let buttonMsg = "Play Solo"
        let buttonStyle = "mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-600/80 shadow-md shadow-gray-400 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"

        if (Object.keys(roomData.players).length > 1) {
            buttonMsg = "Vote to Start"

            let myID = localStorage.getItem('id');
    
            if (roomData.players[myID].ready) {
                buttonMsg = "Ready"
                buttonStyle = "mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-800/80 shadow-md shadow-gray-400 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"
            }
        }

        let myID = localStorage.getItem('id')
      
        return (
            <div className="flex flex-col gap-4 place-items-center mt-20 w-[400px] bg-[rgb(231,229,240)] rounded-3xl">

                <h1 className=" text-2xl font-semibold mt-4">
                    Options
                </h1>
                <div className="flex flex-col gap-4">
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={lifelines}
                            onChange={() => {setLifelines(!lifelines)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(194,191,204)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Lifelines</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={banOption}
                            onChange={() => {setBanOption(!banOption)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Bans</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={hardMode}
                            onChange={() => {setHardMode(!hardMode)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hard Mode</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={randomStart}
                            onChange={() => {setRandomStart(!randomStart)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Random Start Movie</span>
                    </label>

                </div>

                <button className={buttonStyle}
                    onClick={startMatch}
                >
                    {buttonMsg}
                </button>
            </div>
        )
    }


    if(gameData) {

        let msg = ''
    
        if (myTurn) {
            msg = 'Your Turn!'
        }
        else {
            msg = `${capitalizeFirstLetter(roomData.players[gameData.current_id].name)}'s Turn`
        }
    
        let hiddenStyle = ""
        if (roomData.status === 'finished') {
          hiddenStyle = "opacity-10 duration-[4s] delay-[2s] ease-in place-items-center h-full"}
        else {
          hiddenStyle = "opacity-100 place-items-center h-full"
        }
        
    
    
        let history = gameData.history
    
    
        if (history) {
    
            return (
    
                <div className={hiddenStyle}>  
                {/* <h1 className="text-6xl text-gray-50/100 tracking-loose font-semibold hover:cursor-pointer">
                    {msg}
                </h1> */}
    
                <div className="relative mx-auto min-w-[600px] min-h-[600px] flex flex-col overflow-hidden">
                    <div className="absolute bottom-0 w-full flex flex-col -translate-y-40 duration-[2s] ease-in">
                        {
                            history.map((guess, i) => {
    
                                if (i === 0) {
                                    return (
                                        <div key={i} className="pt-[200px] flex flex-col">
                                            <div key={i} className="mx-auto w-[420px] p-4 flex flex-col place-items-center h-full bg-[rgb(216,213,235)] text-[rgb(15,15,11)] rounded-3xl">
                                                <h1 className="text-3xl mb-4 italic">{guess.title}</h1>
    
                                                {
                                                    ['director', 'screenplay', 'cinematographer', 'composer', 'editor', 'cast'].map((title, i) => {
                                                        if (guess[title]) {
                                                            let val = guess[title];
                                                            if (title ==='screenplay' || title ==='cast') {
                                                                val = val.join(', ')
                                                            }
                                                            if (title === 'cast') {
                                                                title = 'Notable Cast'
                                                            }
                                                            return (
                                                                <div key={`${i}A`}>
                                                                    <b>{capitalizeFirstLetter(title)}:</b> {val}
                                                                </div>
                                                            )
                                                        }
                                                    })
                                                }
    
                                            </div>
                                        </div>
                                )
                                }
    
                                else {
    
                                    if (guess.success === 'success') {
                                        
                                        let role = `${guess.second_role}, ${guess.first_role}`
                                        if (['director', 'screenplay', 'cinematographer', 'composer', 'editor'].includes(guess.second_role)) {
                                            role = guess.second_role
                                        }
    
                                        return (
                                            <div key={i} className="flex flex-col place-items-center">
                                                <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                <div key={i} className="mx-auto w-[420px] p-4 flex flex-col place-items-center bg-[rgb(228,189,157)] text-[rgb(15,15,11)] rounded-3xl">
                                                    <h1 className="text-3xl mb-4 italic text-center">{guess.title}</h1>
                                                </div>
                                                <>
                                                <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                <div className="mx-auto w-[240px] py-2 flex flex-col place-items-center bg-[rgb(12,12,31)] text-[rgb(221,218,199)] rounded-lg">
                                                    <p className="text-lg font-light">{capitalizeFirstLetter(role)}</p>
                                                    <p className="text-2xl">{guess.name}</p>
                                                    <div className="flex flex-row gap-2 font-bold text-xl">
                                                        
                                                    {
                                                        guess.link_usage.map((bool, i) => {
                                                            if (bool) {
                                                                return (
                                                                    <div key={i} className="text-[rgb(70,20,20)]">
                                                                        &#x2715;
                                                                    </div>
                                                                )
                                                            }
                                                            else {
                                                                return (
                                                                    <div key={i} className="text-gray-800/60">
                                                                        &#x2715;
                                                                    </div>
                                                                )
                                                            }
                                                        })
                
                                                    }   
                                                        
                                                    </div>
                                                </div>
                                            
                                                </>
                                            </div>
                                        )
                                    }
                                    else {
                                        let msg = <></>;
                                        if (guess.success === 'taken') {
                                            msg = <p>Already Used!</p>
                                        }
                                        return (
                                            <div key={i} className="place-items-center">
                                                <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                <div className="mx-auto w-[500px] p-4 flex flex-col place-items-center bg-[rgb(224,104,104)] text-[rgb(15,15,11)] rounded-3xl">
                                                    <h1 className="text-3xl line-through text-center italic">{guess.title}</h1>
                                                    {msg}
                                                    <h1 className="text-2xl text-center font-semibold">Current movie: <b className="italic font-bold tracking-tight">{history[i - 1].title}</b> </h1>
                                                    {/* <div key={i} className="text-4xl text-[rgb(70,20,20)]">
                                                        &#x2715;
                                                    </div> */}
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            })
                        }
    
                    </div>
                </div>
                
                <div className="w-[700px] mt-[280px] relative flex justify-center items-center">
                    <Timer myTurn={myTurn} roomData={roomData} duration={props.duration} remaining={props.remaining} setRemaining={props.setRemaining} timerKey={props.timerKey}/>
                    <Input socket={socket} roomData={roomData} roomID={roomID} myTurn={myTurn}/>
                </div>
            </div>
            )
        }
    }
    

}



function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}