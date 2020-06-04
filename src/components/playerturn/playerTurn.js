import React from 'react'
import 'animate.css'
import './turn.css'

export default function PlayerTurn(props) {
    return (
<div className="containerturn">      
<h4 className={props.name===0?"animate__animated animate__bounce":null} hidden={(props.name===0)?false:true}>Player Turn : <span style={{color:"#FF652F"}}>{props.players.length>0?props.players[0][props.name].name:null}</span></h4>
<h4 className={props.name===1?"animate__animated animate__bounce":null} hidden={(props.name===1)?false:true}>Player Turn : <span style={{color:"#C3073F"}}>{props.players.length>0?props.players[0][props.name].name:null}</span></h4>
<h4 className={props.name===2?"animate__animated animate__bounce":null} hidden={(props.name===2)?false:true}>Player Turn : <span style={{color:"#FFE400"}}>{props.players.length>0?props.players[0][props.name].name:null}</span></h4>
<h4 className={props.name===3?"animate__animated animate__bounce":null} hidden={(props.name===3)?false:true}>Player Turn : <span style={{color:"#44318D"}}>{props.players.length>0?props.players[0][props.name].name:null}</span></h4>
</div>
 
    )
}
