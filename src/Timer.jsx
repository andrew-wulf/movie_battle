
import { propTypes } from 'react-bootstrap/esm/Image';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'



const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">Time's up!</div>;
  }

  return (
    <div className="timer">
      <div className="value"><h1>{remainingTime}</h1></div>
      <div className="text"></div>
    </div>
  );
};


export function Timer(props) {
  

  return (
    <CountdownCircleTimer
          isPlaying
          duration={props.secs}
          colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
          colorsTime={[30, 20, 10, 0]}
          onComplete={() => {props.timeout}}
        >
          {renderTime}
        </CountdownCircleTimer>
  )
}

