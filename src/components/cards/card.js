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
             name:'',
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
             cards:[],
             PlayerNumber:[],
             cards_box:{
                 first:'',
                 second:'',
                 third:'',
                 fourth:''
             }
        }  
        

    }

    componentWillMount(){
        this.socketEndpoints()
        this.playingGame()
        setTimeout(() => {this.setState({displayLoginMsg:true})}, 3000);
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(this.state.cards!==prevState.cards){
            let cards =this.state.cards[0][this.state.PlayerNumber].sort((a, b)=>a - b)
            this.setState({
                latestCards:cards
            })
        }
        // if(this.state.latestCards!==prevState.)
    }

    playingGame(){
        socket.on('catchcards',({card,Id})=>{
            let player = this.state.players[0].findIndex((element)=>element.id===Id)
            if(player===0){
            this.setState(prevState => ({
                cards_box: {  
                    ...prevState.cards_box,          
                    first: card
                }
            }))
        }else if(player===1){
            this.setState(prevState => ({
                cards_box: {    
                    ...prevState.cards_box,         
                    second: card
                }
            }))
        }else if(player===2){
            this.setState(prevState => ({
                cards_box: {  
                    ...prevState.cards_box,            
                    third: card
                }
            }))
        }else if(player===3) {
            this.setState(prevState => ({
                cards_box: {        
                    ...prevState.cards_box,      
                    fourth: card
                }
            }))
        }
        })
    }




    socketEndpoints(){
        const data = queryString.parse(this.props.location.search)
        this.setState({userId:data.id,room:data.room})
        socket=io(ENDPOINT)  
        socket.emit('joinedUsers',{room:data.room},()=>{})
        socket.on('cards_and_players',({players,cardsarrange})=>{
            let Player_number = Array(players)[0].findIndex((element)=>element.id ===this.state.userId)
            this.setState({
            players:[players],
            cards:[cardsarrange],
            TotalPlayers:players.length,
            PlayerNumber:Player_number
           })
        })

    }

    passCard=(card)=>{
       const Current_Cards = DeleteCard(this.state.latestCards,card)
       this.setState({latestCards:Current_Cards})
       socket =io(ENDPOINT) 
       socket.emit('sendcard',{cardnumber:card,Id:this.state.userId,room:this.state.room},()=>{})
           }

    render() {
        return (  
        <div>{(this.state.cards_box.first===undefined)?console.log("flipcard"):null}
            <Alert variant="success" hidden={this.state.displayLoginMsg} >{this.state.welcomeMsg}</Alert>            
            <div className="Connected">
        <h6 style={{opacity:"10",color:'black'}}>Connected Users{this.state.TotalPlayers}</h6>
        <ul>
        {/* <li>{this.state.names}</li> */}
        </ul>
            </div>

            <div id="boxContainer">
            <img className="boxCards" src={img[this.state.cards_box.first]}></img> 
            <img className="second_boxCards" src={img[this.state.cards_box.second]}></img> 
            <img className="third_boxCards" src={img[this.state.cards_box.third]}></img> 
            <img className="fourth_boxCards" src={img[this.state.cards_box.fourth]}></img>             
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
