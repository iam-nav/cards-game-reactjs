import React, { Component } from 'react'
import Timer from "react-compound-timer";
export default class Timmer extends Component {
    render() {
        return (
            <div>
<Timer
initialTime={5000}
direction="backward"
checkpoints={[
    {
        time: 0,
        callback: () => console.log(this.props.name)
    },
]}
>
{({start,reset, timerState }) => (
    <React.Fragment>
        <div>
            <Timer.Seconds /> seconds
        </div>
        <br />
        {/* <div>
            <button onClick={reset}>Reset</button>
            <button onClick={start}>start</button>
        </div> */}
    </React.Fragment>
)}
</Timer>

            </div>
        )
    }
}
