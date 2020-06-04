import React, { Component} from 'react'

import queryString from 'querystring'
import io from 'socket.io-client'
let socket,ENDPOINT = 'localhost:3001';
export class joinRoom extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
        text:'',
        room:'',
        joinedUsers:[],
        card:false,
        name:'',
        hideRoomDetail:false,
        id:''
        }
    }

    componentDidMount(){
        this.createRoom_Socket()
        this.checkGameStart()   
    }

    createRoom_Socket=()=>{
        socket=io(ENDPOINT)  
        const data = queryString.parse(this.props.location.search)
        this.setState({room:data.room,name:data.name})
        socket.emit('join',{name:data.name,room:data.room},()=>{})
        socket.on('message',({text,user})=>{this.setState({joinedUsers:[text]})})
        socket.on('welcome',({text,user})=>this.setState({text:text,id:user}))
    }

    checkGameStart=()=>{
        socket.on('players',({players})=>{
         window.location.href=`chat?&room=${this.state.room}&id=${this.state.id}`
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