export function Game (props) {


    let roomData = props.roomData;
    let socket = props.socket;
    let roomID = props.roomID;

    console.log(roomData)



    const startMatch = () => {
        socket.emit('start_match', roomID)
    }

    if (roomData.status !== 'match' && roomData.status !== 'finished') {

        if (Object.keys(roomData.players).length > 1) {
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

}