import React, { Component,Jumbotron,Button } from 'react'
import {Link, Route,BrowserRouter} from 'react-router-dom';

import queryString from 'querystring'
import io from 'socket.io-client'
import Card from './cards/card'
let socket,ENDPOINT = 'localhost:3001';
export class joinRoom extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
        room:'',
        joinedUsers:[],
        card:false,
        name:'',
        hideRoomDetail:false
        }
    }

    componentDidMount(){
        this.createRoom_Socket()
        this.checkGameStart()   
    }

    // componentDidUpdate(prevProps, prevState, snapshot){
    //     if(this.state.playgame!==prevState.playgame){
    //         this.setState({
    //             hideRoomDetail:true,
    //             card:true 
    //         })
    //     }
    // }

    createRoom_Socket=()=>{
        socket=io(ENDPOINT)  
        const data = queryString.parse(this.props.location.search)
        this.setState({room:data.room,name:data.name})
        socket.emit('join',{name:data.name,room:data.room},()=>{})
        socket.on('message',({text})=>{this.setState({joinedUsers:[text]})})
    }

    checkGameStart=()=>{
        console.log('reavhsed')
        socket.on('players',({players})=>{
         window.location.href=`chat?&room=${this.state.room}&name=${this.state.name}`
        })
    }


    render() {
        return (
            <div>
            {console.log(this.state.card)}
    <div className="lobby" hidden={this.state.hideRoomDetail}>
        <h1 style={{fontFamily:""}}>Room Name {this.state.room}</h1>
       { this.state.joinedUsers.map((result)=>{
        return result.map((name)=>{     
        return(<ul><li>{name.name}</li></ul>)})})}

    </div>  
   </div>
        )
    }
}

export default joinRoom
