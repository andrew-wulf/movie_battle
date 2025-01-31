import { useEffect, useState } from "react";


export function Input(props) {

    const [searchCache, setSearchCache] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [inputVal, setInputVal] = useState("");

    let socket = props.socket;
    let roomData = props.roomData;
    let roomID = props.roomID;


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
            console.log('CACHE: ', arr[1])
          }
        })
    
        if (cached === false) {
            if (val.length > 1 && searchCache[searchCache.length - 1][1].length < 1) {
                setSearchCache(searchCache => [...searchCache, [val, []]])
            }
            else {
                socket.emit('input_update', val)
            }
        }
      }
    

    useEffect(() => {
        socket.on('recieve_input_update', (val, res) => {
        console.log(val, res);
        setSearchCache(searchCache => [...searchCache, [val, res]])
        setSearchResults(res);
        })
    }, [socket])


    const submit = (arr) => {
        if (roomData.game_data.current_id === localStorage.getItem('id') && roomData.game_data.running) {
            socket.emit('input_submit', roomID, arr);
        }
        setSearchResults([]);
        setInputVal("")
    }



    if (searchResults) {
        return (
            <div className="mt-[800px] w-[500px] h-12 relative bottom-24">
                <div className="z-0 absolute bottom-10 flex flex-col gap-2 w-[500px] text-black bg-[rgb(208,208,228)] text-lg rounded-t-xl overflow-hidden">
                    {
                        searchResults.map((obj, i) => {
                            return (
                                <p className="w-full hover:cursor-pointer hover:bg-sky-100" 
                                    key={i}
                                    onClick={() => {submit(obj)}}
                                    >
                                    {`${obj.title} (${obj.release_date.substring(0,4)})`}
                                </p>
                            )
                        })
                    }
                </div>
    
    
                <input className="z-10 w-[500px] h-12 bg-[rgb(208,208,228)]/80 text-black rounded-xl text-center text-lg"
                    placeholder="Enter a movie title."
                    value={inputVal}
                    onChange={handleUpdate}
                >
                </input>
            </div>
        )
    }

    else {
        return (
            <div className="mt-[800px] relative bottom-24 border border-white">

                <input className="w-96 h-12 bg-gray-300 text-black rounded-xl text-center text-lg"
                    placeholder="Enter a movie title."
                    value={inputVal}
                    onChange={handleUpdate}
                >
                </input>
            </div>
        )    
    }


}