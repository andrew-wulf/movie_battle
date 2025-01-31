import { useState } from "react";
import { Input } from "./Input";

export function Game (props) {


    const [lifelines, setLifelines] = useState(true);
    const [banOption, setBanOption] = useState(false);
    const[hardMode, setHardMode] = useState(false);


    let roomData = props.roomData;
    let socket = props.socket;
    let roomID = props.roomID;
    let myTurn = props.myTurn;

    let gameData = roomData.game_data;



    const startMatch = () => {
        socket.emit('start_match', roomID)
    }
    

    if (roomData.status !== 'active' && roomData.status !== 'finished') {

      
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
                        />
                        <div className="relative w-11 h-6 bg-[rgb(194,191,204)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Lifelines</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={banOption}
                            onChange={() => {setBanOption(!banOption)}}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Bans</span>
                    </label>

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={hardMode}
                            onChange={() => {setHardMode(!hardMode)}}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Hard Mode</span>
                    </label>

                </div>

                <button className="mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-600/80 shadow-md shadow-gray-400 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"
                    onClick={startMatch}
                >
                    Start Match
                </button>
            </div>
        )
    }

    let msg = ''

    if (myTurn) {
        msg = 'Your Turn!'
    }
    else {
        msg = `${capitalizeFirstLetter(roomData.players[gameData.current_id].name)}'s Turn`
    }


    let history = gameData.history


    if (roomData.status === 'active') {

        if (gameData.current_link.length === 0) {
            return (
    
                <>  
                    <h1 className="text-6xl text-gray-50/100 tracking-loose font-semibold hover:cursor-pointer">
                        {msg}
                    </h1>
    
                    <div className="mx-auto min-w-[600px] min-h-[600px] border border-black flex flex-col overflow-hidden">
                        <h1>{gameData.current_movie}</h1>
                    </div>
    
                    <Input socket={socket} roomData={roomData} roomID={roomID} myTurn={myTurn}/>        
                </>
            )
        }
        else {
            return (

                <>  
                <h1 className="text-6xl text-gray-50/100 tracking-loose font-semibold hover:cursor-pointer">
                    {msg}
                </h1>

                <div className="relative mx-auto min-w-[600px] min-h-[600px] border border-black flex flex-col overflow-hidden">
                    <div className="absolute bottom-0 w-full duration-2000">
                        {
                            history.map((guess, i) => {

                                if (guess.success) {
                                    return (
                                        <div key={i} className="flex flex-col gap-10 pt-10">
                                            <div key={i} className="mx-auto w-[420px] p-4 flex flex-col place-items-center bg-gray-600 rounded-3xl">
                                                <h1 className="text-3xl mb-4">{guess.title}</h1>
                                            </div>
                                            <div className="mx-auto w-[240px] py-2 flex flex-col place-items-center bg-gray-600 rounded-lg">
                                                <p className="text-lg font-light">{guess.second_role}</p>
                                                <p className="text-lg font-light">{guess.first_role}</p>
                                                <p className="text-2xl font-semibold">{guess.name}</p>
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
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div key={i}>
                                            <div className="my-10 mx-auto w-[500px] p-4 flex flex-col place-items-center bg-gray-600 rounded-3xl">
                                                <h1 className="text-3xl mb-4 line-through">{guess.title}</h1>
                                                <div key={i} className="text-4xl text-[rgb(70,20,20)]">
                                                    &#x2715;
                                                </div>
                                            </div>
                                            <div className="mx-auto w-[420px] p-4 flex flex-col place-items-center bg-gray-600 rounded-3xl">
                                                <h1 className="text-3xl mb-4">{history[i - 1].title}</h1>
                                            </div>
                                        </div>
                                    )
                                }
                            })
                        }

                    </div>
                </div>

                <Input socket={socket} roomData={roomData} roomID={roomID} myTurn={myTurn}/>        
            </>
            )
        }
    }

}



function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}