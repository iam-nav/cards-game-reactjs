import React from 'react'
import './congrates.css'
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

// import './congo.scss'


function off() {
    document.getElementById("overlay").style.display = "none";
}

export default function congratulation(props) {
    return (
        <div>
  <div id="overlay" onClick={off}>
  <h2 id="text">“Congratulations and BRAVO!”</h2>
    <h3 id="text2">{props.name}</h3><br />
</div>
        </div>
    )
}
