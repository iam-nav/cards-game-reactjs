import React, { Component,Jumbotron,Button } from 'react'
import {Link} from 'react-router-dom';
import queryString from 'querystring'
import io from 'socket.io-client'
import Card from './cards/card'
let socket,ENDPOINT = 'localhost:3001';


export class create extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
        room:'',
        name:'',
        joinedUsers:[],
        text:'',
        id:''
        }
    }

    componentDidMount(){
        this.createRoom_Socket()
    }

    createRoom_Socket(){
        const data = queryString.parse(this.props.location.search)
        this.setState({name:data.name,room:data.room})
        socket=io(ENDPOINT)  
        socket.emit('join',{name:data.name,room:data.room},()=>{})
        socket.on('welcome',({text,user})=>this.setState({text:text,id:user}))
        socket.on('message',({text})=>{
            this.setState({
                joinedUsers:[text]
            })
        })
    }

    startGame=()=>{
        socket=io(ENDPOINT) 
        socket.emit('playgame',{players:this.state.joinedUsers,room:this.state.room})
    }


    render() {
        return (
            <div>
    <div className="lobby">
        <h1 style={{fontFamily:""}}>Room Name {this.state.room}</h1>
       { this.state.joinedUsers.map((result)=>{
        return result.map((name,index)=>{     
        return(<ul><li key={index}>{name.name}</li></ul>)})})}
        <Link to={`/chat?&room=${this.state.room}&id=${this.state.id}`}>
        <button className="startGame"  onClick={()=>this.startGame()}>Start</button>
        </Link>

    </div>
    <div>
    </div>
  
   </div>
        )
    }
}

export default create
