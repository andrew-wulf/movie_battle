import { useEffect, useState } from "react";
import { Input } from "./Input";
import { Timer } from "./Timer";

export function Game (props) {


    const [lifelines, setLifelines] = useState(true);
    const [banOption, setBanOption] = useState(false);
    const [hardMode, setHardMode] = useState(false);
    const [randomStart, setRandomStart] = useState(false);
    const [randomType, setRandomType] = useState('popular');
    const [timerSetting, setTimerSetting] = useState(30);


    const [translateY, setTranslateY] = useState(0);
    const [historyStyle, setHistoryStyle] = useState("absolute w-full flex flex-col duration-[3s] ease-out")

    const [pageJustLoaded, setPageJustLoaded] = useState(true);

    let roomData = props.roomData;
    let socket = props.socket;
    let roomID = props.roomID;
    let myTurn = props.myTurn;

    let gameData = roomData.game_data;

    


    useEffect(() => {
        setTimeout(() => {
            setPageJustLoaded(false);
        }, 2000)
    }, [])


    useEffect(() => {
        let history = document.getElementById('history');
        if (history) {
 
            let rect = history.getBoundingClientRect();
            let bottom = rect.bottom;   
            let targetY = window.innerHeight - (window.innerHeight * 0.55);
    
            //console.log('target: ', targetY, 'bottom: ', bottom)
            
            if (bottom !== targetY) {
                if (bottom > targetY && pageJustLoaded === false) {
                    setHistoryStyle("absolute w-full flex flex-col duration-[2s] ease-out")
                }
                else {
                    setHistoryStyle("absolute w-full flex flex-col")
                }

                let translate = (targetY - bottom)
                // console.log(translateY)
                // console.log(translate)
                setTranslateY(translate + translateY)
            }
        }

    }, [roomData])


    const optionsUpdate = (key, value) => {
        //console.log(roomID, key, value)
        socket.emit('options_update', roomID, key, value)
    }


    const startMatch = () => {
        socket.emit('start_match', roomID)
    }
    

    if (roomData.status !== 'active' && roomData.status !== 'finished' && roomData.status !== 'first_pick') {
        

        let buttonMsg = "Play Solo"
        let buttonStyle = "mt-2 mb-5 mx-auto w-40 min-h-10 bg-blue-600/80 shadow-md shadow-gray-400 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"

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
                
                <label className="inline-flex items-center cursor-pointer gap-4">
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Timer Duration</span>
                    <div className="w-18 relative">
                        <select
                            onChange={(e) => {optionsUpdate('timer', e.target.value)}}
                            value={roomData.options.timer}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                            className="w-full bg-gray-100 placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow cursor-pointer appearance-none">
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="h-5 w-5 ml-1 absolute top-2.5 right-2.5 text-slate-700">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                        </svg>
                    </div>
                </label>

                <div className="flex flex-col gap-4 ">

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={roomData.options.lifelines}
                            onChange={() => {optionsUpdate('lifelines', !roomData.options.lifelines)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(194,191,204)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Lifelines</span>
                    </label>

                    {/* <label className="inline-flex items-center cursor-pointer">
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
                    </label> */}

                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"
                            checked={roomData.options.random_start}
                            onChange={() => {optionsUpdate('random_start', !roomData.options.random_start)}}
                            disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                        />
                        <div className="relative w-11 h-6 bg-[rgb(189,185,206)] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"/>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Random Start</span>
                    </label>
                </div>

                <div className={roomData.options.random_start === true ? "block" : "hidden"}>
                    <p className="mt-4 mb-2 text-center text-xl font-semibold tracking-tight">Starting Movie</p>
                    <div className="inline-flex mb-2 w-80">
                        <div className={roomData.options.random_type === 'popular' ? "bg-gray-400" : "bg-gray-300"}>
                            <button className=" hover:shadow-md shadow:blue-700 text-gray-800 font-bold py-2 px-4 rounded-l hover:cursor-pointer"
                                onClick={() => {optionsUpdate('random_type', 'popular')}}
                                disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                            >
                                Random Popular
                            </button> 
                        </div>
                        <div className={roomData.options.random_type === 'top_rated' ? "bg-gray-400" : "bg-gray-300"}>
                            <button className=" hover:shadow-md shadow:blue-700 text-gray-800 font-bold py-2 px-4 rounded-r hover:cursor-pointer"
                                onClick={() => {optionsUpdate('random_type', 'top_rated')}}
                                disabled={Object.keys(roomData.players)[0] === myID ? false : true}
                            >
                                Random Top Rated
                            </button>
                        </div>
                    </div>
                </div>

                <button className={buttonStyle}
                    onClick={startMatch}
                >
                    {buttonMsg}
                </button>
            </div>
        )
    }

    if (roomData.status === 'first_pick') {
        return (
            <>
            <div className="relative mx-auto min-w-[600px] min-h-[600px] flex flex-col overflow-hidden">
                <h1 className="text-gray-200 text-4xl font-semibold mx-auto mt-80">{gameData.current_name.name} is picking the first movie.</h1>
            </div>
                <div className="w-[700px] mt-[280px] relative flex justify-center items-center">
                    <Timer myTurn={myTurn} roomData={roomData} duration={props.duration} remaining={props.remaining} setRemaining={props.setRemaining} timerKey={props.timerKey}/>
                    <Input socket={socket} roomData={roomData} roomID={roomID} myTurn={myTurn}/>
                </div>
            </>
        )
    }


    if(gameData) {
    
        // let msg = ''
    
        // if (myTurn) {
        //     msg = 'Your Turn!'
        // }
        // else {
        //     msg = `${capitalizeFirstLetter(roomData.players[gameData.current_id].name)}'s Turn`
        // }
    
        let hiddenStyle = ""
        if (roomData.status === 'finished') {
          hiddenStyle = "opacity-10 duration-[3s] delay-[2s] ease-in place-items-center h-full"}
        else {
          hiddenStyle = "opacity-100 place-items-center h-full"
        }
        
    
    
        let history = gameData.history
    
    
        if (history && history.length > 0 && roomData.status !== 'first_pick') {

            let img = <></>

            if (history.length === 1 && roomData.status !== 'finished') {
                img = <img key={history[0].image} src={history[0].image} className="absolute h-[260px] top-[460px] left-1/2 -translate-x-1/2 rounded-xl animate-fade-out-scale" style={{animationDelay: '5s'}}/>
                             
            }

            return (    
    
                <div className={hiddenStyle}>  
                {/* <h1 className="text-6xl text-gray-50/100 tracking-loose font-semibold hover:cursor-pointer">
                    {msg}
                </h1> */}
                
                {/* {img} */}
    
                <div className="relative mx-auto min-w-[600px] min-h-[600px] flex flex-col overflow-hidden">
                    <div id='history' className={historyStyle} style={{transform: `translate(0, ${translateY}px)`}}>
                        {
                            history.map((guess, i) => {
    
                                if (i === 0 ) {
                                    return (
                                        <div key={i} className="">
                                                                                        
                                            <div className="relative mx-auto w-[420px] p-4 flex flex-col place-items-center h-full bg-black/85 text-gray-300 rounded-3xl">
                                                <div key={i} className="mx-auto w-full p-4 flex flex-row gap-8 place-items-center  rounded-3xl">
                                                    <img src={guess.image} className="w-14 rounded-2xl"/>
                                                    <h1 className="text-3xl mb-4 italic text-center">{guess.title}</h1>
                                                </div>
    
                                                <div className="w-[400px] mx-auto text-md grid grid-cols-2 gap-2">
                                                    {
                                                        ['director', 'screenplay', 'cinematographer', 'composer'].map((title, i) => {
                                                            if (guess[title]) {


  
                                                                let val = guess[title].slice(0, 2).join(', ')
                                                                

                                                                if (title === 'cast') {
                                                                    title = 'Notable Cast'
                                                                }

                                                                if (val) {
                                                                    return (
                                                                        <div key={`${i}A`} className="z-20 flex flex-col">
                                                                            <h1 className="text-gray-400 text-sm">{capitalizeFirstLetter(title)}</h1>
                                                                            <p className="text-gray-100">{val}</p>
                                                                        </div>
                                                                    )
                                                                }
                                                            }
                                                        })
                                                    }
                                                </div>
                                                <div className="mt-4 flex flex-col place-items-center">
                                                    <h1 className="w-60 text-sm text-gray-400 text-center">Notable Cast</h1>
                                                    <p className="text-center w-3/4 text-gray-100">{guess['cast'].join(', ')}</p>
                                                </div>

                                            </div>
                                        </div>
                                )
                                }
    
                                else {
    
                                    if (guess.success === 'success') {

                                        let role = `${guess.second_role}, ${guess.first_role}`

                                        if (guess.show_info) {

                                            return (
                                                <div key={i} className="flex flex-col place-items-center">

                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <>
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
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div className="relative mx-auto w-[420px] p-4 flex flex-col place-items-center h-full bg-black/85 text-gray-300 rounded-3xl">
                                                        <div key={i} className="mx-auto w-full p-4 flex flex-row gap-8 place-items-center  rounded-3xl">
                                                            <img src={guess.image} className="w-14 rounded-2xl"/>
                                                            <h1 className="text-3xl mb-4 italic text-center">{guess.title}</h1>
                                                        </div>
            
                                                        <div className="w-[400px] mx-auto text-md grid grid-cols-2 gap-2">
                                                            {
                                                                ['director', 'screenplay', 'cinematographer', 'composer'].map((title, i) => {
                                                                    if (guess[title]) {


                                                                        let val = guess[title].slice(0, 2).join(', ')
                                                                        

                                                                        if (title === 'cast') {
                                                                            title = 'Notable Cast'
                                                                        }

                                                                        if (val) {
                                                                            return (
                                                                                <div key={`${i}A`} className="z-20 flex flex-col">
                                                                                    <h1 className="text-gray-400 text-sm">{capitalizeFirstLetter(title)}</h1>
                                                                                    <p className="text-gray-100">{val}</p>
                                                                                </div>
                                                                            )
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        </div>
                                                        <div className="mt-4 flex flex-col place-items-center">
                                                            <h1 className="w-60 text-sm text-gray-400 text-center">Notable Cast</h1>
                                                            <p className="text-center w-3/4 text-gray-100">{guess['cast'].join(', ')}</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            )
                                        }

                                        else {           
                                            if (['director', 'screenplay', 'cinematographer', 'composer', 'editor'].includes(guess.second_role)) {
                                                role = guess.second_role
                                            }
        
                                            return (
                                                <div key={i} className="flex flex-col place-items-center">
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <>
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
    
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div key={i} className="mx-auto w-[420px] p-4 flex flex-row gap-8 place-items-center bg-black/85 text-gray-300 rounded-3xl">
                                                        <img src={guess.image} className="w-14 rounded-2xl"/>
                                                        <h1 className="text-3xl mb-4 italic text-center">{guess.title}</h1>
                                                    </div>
                                                </div>
                                            )

                                        }
                                        
                                    }
                                    else {
                                        if (guess.success === 'expired') {
                                            return (
                                                <div key={i} className="place-items-center">
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div className="mx-auto w-[240px] py-2 px-4 flex flex-row place-items-center gap-4 bg-[rgb(12,12,31)] text-[rgb(221,218,199)] rounded-lg">
                                                        <div className="text-4xl text-[rgb(128,36,36)]">
                                                             &#x2715;
                                                        </div>
                                                        <p>Out of time!</p>                                   
                                                    </div>

                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div key={i} className="mx-auto w-[420px] p-4 flex flex-row gap-8 place-items-center bg-black/85 text-gray-300 rounded-3xl">
                                                        <img src={guess.image} className="w-14 rounded-2xl"/>
                                                        <h1 className="text-3xl mb-4 italic text-center">{history[i - 1].title}</h1>
                                                    </div>
                                                </div>
                                            )
                                        }
                                        else {
                                            let content = <></>;
                                            let msg = 'No links';
                                            if (guess.success === 'taken') {
                                                msg = 'Taken!'
                                            }

                                            return (
                                                <div key={i} className="place-items-center">
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div className="mx-auto w-[240px] py-2 flex flex-col place-items-center bg-[rgb(12,12,31)] text-[rgb(221,218,199)] rounded-lg">
                                                        {msg}
                                                    </div>
                                                    <div className="w-[3px] h-20 bg-[rgb(12,12,31)]/50"/>
                                                    <div key={i} className="mx-auto w-[420px] p-4 flex flex-row gap-8 place-items-center bg-black/85 text-gray-300 rounded-3xl">
                                                        <img src={guess.image} className="w-14 rounded-2xl"/>
                                                        <div className="flex flex-col">
                                                            <h1 className="text-2xl line-through text-center italic">{guess.title}</h1>
                                                            <h1 className="text-xl text-center font-semibold">Current movie: <b className="italic font-bold tracking-tight">{history[i - 1].title}</b> </h1>
                                                        </div>
                                                    </div>
                                                </div>
    
                                            )
                                        }

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