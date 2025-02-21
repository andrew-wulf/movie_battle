export function GameOverModal(props) {

    let socket = props.socket;
    let roomID = props.roomID;
    let roomData = props.roomData;
    let readyCount = props.readyCount

    const startMatch = () => {
        socket.emit('start_match', roomID)
    }

    if (roomData.game_data) {

      let msg = <h1>
                  Game Over
                </h1>;

      let winner_ids = roomData.game_data.winner_ids;

      if (Object.keys(roomData.players).length > 1 && winner_ids.length > 0) {
        msg = <h1>
                  <b className="font-normal text-gray-200">{roomData.players[winner_ids[0]].name}</b> is the Winner!
              </h1>;

        if (winner_ids.length > 1) {
          let names = winner_ids.map(id => {return roomData.players[id].name});
          names = names.join(', ');
          names = names.replace(/, (?=[^,]+$)/, " and ");

          msg = <h1 className="max-w-[360px] text-center">
                  Match ended in a draw between <b className="font-normal text-gray-200">{names}</b>.
              </h1>;
        }
      }

      let hiddenStyle = ""
      if (props.show) {
        hiddenStyle = "opacity-100 duration-[3s] delay-[1.8s] ease-in fixed w-[600px] h-[400px] bg-black/85 text-gray-300/85 rounded-2xl flex flex-col justify-between py-10 place-items-center text-2xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group"
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
        roundcount = Math.max(history.length - 1, 0)
      }

      let readyMsg = <></>;

      if (readyCount > 0 && roomData.players) {
          readyMsg = <p className="absolute right-3/16 text-lg pb-1 text-gray-400 font-bold">{readyCount}/{Object.keys(roomData.players).length}</p>
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

            <div className="relative flex w-[400px] place-items-center">
              <button className={buttonStyle}
                  onClick={startMatch}
                  >
                      {buttonMsg}
              </button>
              {readyMsg}
            </div>
  
          </section>
      );
    }
  }