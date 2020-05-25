import React, { Component } from 'react'
import {Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {DeleteCard} from './functions/functions'
import './cards.css'
import img from './functions/decksLocation'
import queryString from 'querystring'
import Timmer from '../timmer'
import io from 'socket.io-client'
import {two_Players} from './functions/largest_Cards'
import {availabe_cards}  from './functions/filter_current_cards'
import { totalmem } from 'os';
let socket,ENDPOINT = 'localhost:3001';
export class Card extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             box:[],
             name:'',
             latestCards:[],
             img:[],
             name:'',
             room:'',
             TotalPlayers:'',
             displayLoginMsg:false,
             welcomeMsg:'',
             userId:'',
             playgame:[],
             players:[],
             cards:[],
             PlayerNumber:'',
             flip:true,
             cards_box:{
                 first:null,
                 second:null,
                 third:null,
                 fourth:null
             },
             checkTurn:0,
             count:10,
             timmer_repeat:0,
             greater_card:[]
        }  
    }

    // componentDidMount(){
    //  this.interval = setInterval(()=>{
    //     const {timmer_repeat}= this.state
    //         this.setState(prevState=>({
    //             count:prevState.count-1
    //         }))
    //          if(this.state.count===0){
    //         this.setState({count:10,timmer_repeat:timmer_repeat+1})
    //         }
    //     },1000) 
    //     }


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

        if(this.state.timmer_repeat!==prevState.timmer_repeat){
         this.setplayer_turn()
        //  console.log(this.state.players[0][this.state.checkTurn].name)
        }

        if(this.state.cards_box!==prevState.cards_box){
        if(this.state.TotalPlayers===2){

           this.playing_Two_players()
        }
        if(this.state.TotalPlayers===3){
            this.playing_Three_players()
        }
        if(this.state.TotalPlayers===4){
            this.playing_four_players()
        }

 }
 
}

setplayer_turn(){
    const {timmer_repeat,TotalPlayers,checkTurn}= this.state
    if(timmer_repeat!==TotalPlayers){
        this.setState({
            checkTurn:checkTurn+1
        })
    }else{
       return this.setState({timmer_repeat:0,checkTurn:-1})
    }
}

playing_Two_players(){
        const {first,second}= this.state.cards_box
        if(first!==null && second!==null){
          const largest =  two_Players(first,second) //finding larget number
          (largest===first)?this.setState({checkTurn:0}):this.setState({checkTurn:1}) //setting turn of the player
            setTimeout(()=>{
             this.setState(prevState => ({
                 cards_box: {  
                     ...prevState.cards_box,          
                     first: null,
                     second:null,
                 }
          }))
         },2500)
          }
}

playing_Three_players(){
        const {first,second,third}= this.state.cards_box
        if(first!==null && second!==null && third!==null){
            setTimeout(()=>{
             this.setState(prevState => ({
                 cards_box: {  
                     ...prevState.cards_box,          
                     first: null,
                     second:null,
                     third:null,
                 }
          }))
         },2500)
          }
}
playing_four_players(){
        const {first,second,third,fourth}= this.state.cards_box
        if(first!==null && second!==null && third!==null){
            setTimeout(()=>{
             this.setState(prevState => ({
                 cards_box: {  
                     ...prevState.cards_box,          
                     first: null,
                     second:null,
                     third:null,
                     fourth:null
                 }
          }))
         },2500)
          }
}


playingGame(){
        socket.on('catchcards',({card,Id})=>{
            // console.log("mycards"+availabe_cards(card,this.state.latestCards))
            // console.log(chooseCards)
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
    //   if(this.state.checkTurn!==this.state.PlayerNumber){
    //     return console.log(this.state.checkTurn) 
    // }
       const Current_Cards = DeleteCard(this.state.latestCards,card)
       this.setState({latestCards:Current_Cards})
       socket =io(ENDPOINT) 
       socket.emit('sendcard',{cardnumber:card,Id:this.state.userId,room:this.state.room},()=>{})
    }

    render() {
        return (  
        <div>
        {/* timmer below */}
        <h1>{this.state.count}</h1>  
        <h2>{this.state.name}</h2>
        <p>{this.state.checkTurn}</p>
            <Alert variant="success" hidden={this.state.displayLoginMsg} >{this.state.welcomeMsg}</Alert>            
            <div className="Connected">
        <h6 style={{opacity:"10",color:'black'}}>Connected Users{this.state.TotalPlayers}</h6>
        <ul>
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
