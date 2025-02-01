export function GameOverModal(props) {

    let socket = props.socket;
    let roomID = props.roomID;
    let roomData = props.roomData;

    const startMatch = () => {
        socket.emit('start_match', roomID)
    }

    if (roomData.game_data) {

      let msg = <h1>
                  Game Over
                </h1>;

      if (Object.keys(roomData.players).length > 1 && roomData.game_data.winner_id) {
        msg = <h1>
                  <b className="font-normal text-gray-200">{roomData.players[roomData.game_data.winner_id].name}</b> is the Winner!
              </h1>;
      }

      let hiddenStyle = ""
      if (props.show) {
        hiddenStyle = "opacity-100 duration-[4s] delay-[1.8s] ease-in fixed w-[600px] h-[400px] bg-black/85 text-gray-300/85 rounded-2xl flex flex-col justify-between py-10 place-items-center text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group"
      }
      else {
        hiddenStyle = "opacity-0 fixed w-[600px] h-[400px] bg-black/65 text-gray-300/85 rounded-2xl flex flex-col justify-between py-10 place-items-center text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20 group"
      }

      let buttonMsg = "Play Again"
      let buttonStyle = "mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-600/80 shadow-md shadow-gray-900 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"
      if (Object.keys(roomData.players).length > 1) {
          buttonMsg = "Vote for Rematch"

          let myID = localStorage.getItem('id');
  
          if (roomData.players[myID].ready) {
              buttonMsg = "Ready"
              buttonStyle = "mt-5 mb-5 mx-auto w-40 min-h-10 bg-blue-700/80 shadow-md shadow-gray-900 rounded-2xl text-lg font-semibold text-black hover:cursor-pointer hover:bg-blue-700/70 tracking-wide"
          }
      }
      let roundcount = ""
      let history = roomData.game_data.history

      if (history) {
        roundcount = history.length - 1
      }

      return (
          <section onClick={(e) => {e.stopPropagation(); }} className={hiddenStyle}>
            {msg}
            <p>
                You lasted <b className="font-normal text-gray-200">{roundcount} rounds.</b>
            </p>

            <p>
                Play again?
            </p>

            <button className={buttonStyle}
                onClick={startMatch}
                >
                    {buttonMsg}
            </button>
  
          </section>
      );
    }
  }