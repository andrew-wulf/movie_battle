import { Input } from "./Input";

export function Game (props) {


    let roomData = props.roomData;
    let socket = props.socket;
    let roomID = props.roomID;



    const startMatch = () => {
        socket.emit('start_match', roomID)
    }

    if (roomData.status !== 'active' && roomData.status !== 'finished') {

        if (Object.keys(roomData.players).length > 0) {
            return (
                <h1 className="mt-96 text-6xl text-gray-200/80 tracking-loose font-semibold hover:cursor-pointer hover:text-white"
                    onClick={startMatch}
                >
                    Start Match
                </h1>
            )
        }
        else {
            return (
                <h1 className="mt-96 text-6xl text-gray-400/40 tracking-loose font-semibold">
                    Start Match
                </h1>
            )
        }
    }

    if (roomData.status === 'active') {


        return (
            <Input socket={socket}/>
        )
    }

}