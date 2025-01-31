export function GameOverModal(props) {

    let socket = props.socket;
    let roomID = props.roomID;
    let roomData = props.roomData;

    const startMatch = () => {
        socket.emit('start_match', roomID)
    }

    if (props.show && roomData.game_data) {

      return (
        <div onClick={props.onClose} className="fixed top-0 left-0 w-full h-full bg-gray-700/25 dark:bg-[rgb(6,6,16)]/80 z-10">
          <section onClick={(e) => {e.stopPropagation(); }} className="fixed w-[600px] h-[400px] bg-black/65 text-gray-300/85 rounded-2xl flex flex-col justify-between py-10 place-items-center text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group">

            <h1>
                <b className="font-normal text-gray-200">{roomData.players[roomData.game_data.winner_id].name}</b> is the Winner!
            </h1>
            <p>
                You lasted <b className="font-normal text-gray-200">{roomData.game_data.history.length - 1} rounds.</b>
            </p>

            <p>
                Play again?
            </p>

            <button className="mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-600/80 shadow-md shadow-gray-900 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"
                onClick={startMatch}
                >
                    Play Again
            </button>
  
          </section>
        </div>
      );
    }
  }