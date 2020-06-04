import React from 'react'
import './congrates.css'
// import './congo.scss'


function off() {
    document.getElementById("overlay").style.display = "none";
}

export default function congratulation(props) {
    return (
        <div>

<div class="pyro">
  <div class="before"></div>
  <div id="overlay" onClick={off}>
  <h2 id="text">“Congratulations and BRAVO!”</h2>
    <h3 id="text2">{props.name}</h3>
</div>
  <div class="after"></div>
</div>
        </div>
    )
}
