import React, { Component} from 'react'
import { Card,Menu} from 'antd';
import {Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {CopyOutlined,FacebookOutlined,WhatsAppOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './custom.css'
import queryString from 'querystring'
import io from 'socket.io-client'
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


    copy=()=>{
        navigator.clipboard.writeText(this.state.room)
    }
    

    render() {
        
const { SubMenu } = Menu;
        return (
            <div>
   <h1 style={{fontFamily:"'Alfa Slab One', cursive",fontSize:"80px",textAlign:"center",marginTop:"10px"}}>Cards</h1>
<div className="site-card-border-less-wrapper" style={{marginLeft:"35%",marginTop:"-1%"}}>
    <Card title={`Room Name : ${this.state.room}`} extra={
    <Menu>
      <SubMenu title="share Code">
        <Menu.Item onClick={this.copy}> <CopyOutlined />Copy Room</Menu.Item>
        <Menu.Item> <FacebookOutlined />facebook</Menu.Item>
        <Menu.Item> <WhatsAppOutlined />whatsApp</Menu.Item>
      </SubMenu>
    </Menu>
    } bordered={false} style={{ width: 400 }}>
               { this.state.joinedUsers.map((result)=>{
        return result.map((name,index)=>{     
        return(<ul style={{marginLeft:"-30px"}}><li key={index}>{name.name}</li></ul>)})})}
      <Button href={`/chat?&room=${this.state.room}&id=${this.state.id}`} onClick={this.startGame}>Lets Play</Button>
    </Card>
  </div>,

);
   </div>

        )
    }
}

export default create
