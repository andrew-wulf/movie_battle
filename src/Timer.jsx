
import { useEffect, useRef, useState } from 'react';
import { propTypes } from 'react-bootstrap/esm/Image';
import { CountdownCircleTimer } from 'react-countdown-circle-timer'



export function Timer(props) {
  

  let [count, setCount] = useState(-1);
  let [delay, setDelay] = useState(1000);
  
  let roomData = props.roomData;
  let duration = props.duration;
  let remaining = props.remaining;
  let timerKey = props.timerKey;

  useInterval(() => {
    if (remaining && remaining > 0) {
      props.setRemaining(remaining - 1)
    }
  }, delay);

  

  if (remaining && roomData && (roomData.status === 'active' || roomData.status === 'first_pick')) {
    return (
      <div key={timerKey} className="ml-0">
          <CountDownTimer duration={duration} remaining={remaining}/>
      </div>
    )
    
  }
  
}



const renderTime = ({ remainingTime }) => {
  if (remainingTime === 0) {
    return <div className="timer">0</div>;
  }

  return (
    <div className="timer">
      <div className="text-3xl text-gray-200 mx-auto"><h1>{remainingTime}</h1></div>
      <div className="text"></div>
    </div>
  );
};


export function CountDownTimer(props) {
  let duration = props.duration;
  let remaining = props.remaining;
  
  return (
    <CountdownCircleTimer
    isPlaying
    duration={duration}
    initialRemainingTime={remaining}
    colors={["#155dfc", "#F7B801", "#A30000", "#A30000"]}
    colorsTime={[duration, duration * 2 / 3, duration/3, 0]}
    size={80}
    strokeWidth={8}

    onComplete={() => {props.timeout}}
    >
            {renderTime}
    </CountdownCircleTimer>
  )
    
}



function useInterval(callback, delay) {
  const savedCallback = useRef();
 
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
 
  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}