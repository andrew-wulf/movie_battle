import { useState } from "react";



export function Intro(props) {
  let name = props.name;

  const [nameInputVal, setNameInputVal] = useState("");

  return (
    // <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-black">
    //   <h1>Please enter your name.</h1>
    //   <input value={nameInputVal} onChange={(e) => {setNameInputVal(e.target.value)}}/>
    //   <button onClick={() => {props.updateName(nameInputVal)}}>Continue</button>
    // </div>

    <>
      <div className=" absolute inset-0 transition-all -z-10 bg-radial-[at_50%_50%] from-[rgb(60,71,231)] to-[rgb(2,7,72)]">
      </div>
      <div className="bg-auto absolute inset-0 -z-10 mix-blend-overlay bg-[rgb(61,62,87)]">
      </div>
    </>
  )
}

