import React, { Component} from 'react'
import { Card } from 'antd';
import queryString from 'querystring'
import io from 'socket.io-client'
let socket,ENDPOINT = 'https://cardsgame0navjot.herokuapp.com/';
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
<h1 style={{fontFamily:"'Alfa Slab One', cursive",fontSize:"80px",textAlign:"center",marginTop:"10px"}}>Cards</h1>
<div className="site-card-border-less-wrapper" style={{marginLeft:"35%",marginTop:"-1%"}}>
    <Card title={`Joined Room : ${this.state.room} `} bordered={false} style={{ width: 400 }}>
    { this.state.joinedUsers.map((result)=>{
        return result.map((name)=>{     
        return(<ul style={{marginLeft:"-30px"}}><li>{name.name}</li></ul>)})})}
    </Card>
  </div>,
    </div>  
        )
    }
}

export default joinRoom
