import React, { Component } from 'react'
import {Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {shuffle,deck,DistributeCards,PlayersJoin,DeleteCard,activeUSers} from './functions/functions'
import './cards.css'
import img from './functions/decksLocation'
import queryString from 'querystring'
import io from 'socket.io-client'
import { isArray } from 'util';
let socket,ENDPOINT = 'localhost:3001';
export class Card extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             box:[],
             latestCards:[],
             img:[],
             names:[],
             room:'',
             TotalPlayers:'',
             displayLoginMsg:false,
             welcomeMsg:'',
             userId:'',
             playgame:[],
             players:[],
             cards:[]
        }  
        

    }

    componentDidMount(){
        // this.currentPlayer(4,1)
        this.socketEndpoints()
        setTimeout(() => {this.setState({displayLoginMsg:true})}, 3000);
    }

    socketEndpoints(){
        const data = queryString.parse(this.props.location.search)
        socket=io(ENDPOINT)  
        socket.emit('joinedUsers',{room:data.room},()=>{})
        socket.on('cards_and_players',({players,cardsarrange})=>{
        let ActivePlayers =  JSON.stringify(players)
           this.setState({
            players:[players],
            cards:[cardsarrange]
           })
        })}
        // socket=io(ENDPOINT)  
        // const data = queryString.parse(this.props.location.search)
        // const rooms = data.room
        // console.log(rooms)
        // socket.emit('joinedUsers',({rooms})=>{
          
        // })


        // const data = queryString.parse(this.props.location.search)
        // let valuse  = JSON.stringify(data)
        // console.log(this.props.name)
        // // this.setState({name:data.name,room:data.room})
        // socket =io(ENDPOINT)  
        // socket.emit('join',{name:data.name,room:data.room},()=>{
        // })
        // socket.on('welcome',({text,user})=>{
        //     console.log(text,user)
        //     this.setState({welcomeMsg:text,userId:user})
        // })
        // socket.on('message',({CountPlayers_room})=>{
        //     this.setState({TotalPlayers:CountPlayers_room})
        //     console.log(CountPlayers_room)
        // })
        // socket.on('catchcards',({card})=>{
        //     console.log(card)
        // })
      

    currentPlayer(TotalPlayer,currentPlayer){
        let shuffles = shuffle(deck())
        let CardsArrange = DistributeCards(shuffles,PlayersJoin(TotalPlayer))
        let Current_Cards= CardsArrange[currentPlayer-1]
        this.setState({latestCards:Current_Cards}) 
    }



    
    passCard=(card)=>{
       const Current_Cards = DeleteCard(this.state.latestCards,card)
       this.setState({latestCards:Current_Cards})
       this.setState({box:[...this.state.box,card],})
       socket =io(ENDPOINT) 
       socket.emit('sendcard',{cardnumber:card,Id:this.state.userId},()=>{        })
       console.log(this.state.box)
           }

    render() {
        return (  
        <div>
            <Alert variant="success" hidden={this.state.displayLoginMsg} >{this.state.welcomeMsg}</Alert>            
            <div className="Connected">
        <h6 style={{opacity:"10",color:'black'}}>Connected Users {this.state.userId} {this.state.TotalPlayers}</h6>
        <ul>
        <li>{this.state.names}</li>
        </ul>
            </div>

            <div id="boxContainer">
                {this.state.box.map((result,index)=>{
                    return(
                    <img className="boxCards" src={img[result]} key={index}></img> 
                 ) })}
            </div>     
            <div className="container">
           {this.state.latestCards.map((result,index)=>{
               return(
         <img className="cardsImage" onClick={()=>this.passCard(result)} src={img[result]} key={index}></img> 
               )
            })}
            </div>
            </div>
            
        )
    }
}

export default Card
