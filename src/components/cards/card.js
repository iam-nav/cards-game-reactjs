import React, { Component } from 'react'
import {Alert} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import {DeleteCard} from './functions/functions'
import './cards.css'
import img from './functions/decksLocation'
import queryString from 'querystring'
import Timmer from '../timmer'
import io from 'socket.io-client'
import {chk_cards} from './functions/adding_cards'
import {two_Players,three_Players,Four_Players} from './functions/largest_Cards'
import {availabe_cards,removeFromLatestCards}  from './functions/filter_current_cards'
import { totalmem } from 'os';
let socket,ENDPOINT = 'localhost:3001';
export class Card extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             box:[],                                                     // cards player shows
             name:'',                                                    //name of the player
             latestCards:[],                                             //cards players have
             img:[],
             name:'',
             room:'',
             TotalPlayers:'',                                            
             displayLoginMsg:false,                                                                 
             welcomeMsg:'',                                              //welcome msg on joining group
             userId:'',                                                 // current player's user id
             players:[],                                                //total players
             cards:[],                                                  //total cards
             PlayerNumber:'',                                          //player's number
             flip:true,                                                // cards backside
             cards_box:{                                              //players position
                 first:null,
                 second:null,
                 third:null,
                 fourth:null
             },
             checkTurn:0,                                         //checking which player turn
             count:10,                                           //countdown
             timmer_repeat:0,                                   //checking timmer repeat time
             check_cards:[],                                   //card throw from given cards
             old_check_cards:[],                               //append check_cards
             hideCheckcards:false, 
             EmptyCards:false
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
        this.pushCardToOpponet()
        setTimeout(() => {this.setState({displayLoginMsg:true})}, 1000);
}

componentDidUpdate(prevProps, prevState, snapshot){
        if(this.state.cards!==prevState.cards){
            let cards =this.state.cards[0][this.state.PlayerNumber].sort((a, b)=>a - b)
            this.setState({ 
                latestCards:cards
            })
        }

        // if(this.state.timmer_repeat!==prevState.timmer_repeat){
        //  this.setplayer_turn()
        // //  console.log(this.state.players[0][this.state.checkTurn].name)
        // }

        if(this.state.check_cards!==prevState.check_cards){
        const curent_cards = removeFromLatestCards(this.state.latestCards,this.state.check_cards)
        this.setState({latestCards:curent_cards})
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

pushCardToOpponet(){
    socket.on('pushCardToOpponet',({cards,id})=>{
        //Two Players Playing
        if(this.state.TotalPlayers ===2){
         if(this.state.userId !== id){
            const addCards = this.state.latestCards.concat(this.state.check_cards,cards)
            this.setState({latestCards:addCards,check_cards:[]})
        }
    }//three players playing
        if(this.state.TotalPlayers ===3){
            if(this.state.userId === id){
                const addCards = this.state.latestCards.concat(this.state.check_cards,cards)
                this.setState({latestCards:addCards,check_cards:[],})
                this.setState(prevState => ({
                    cards_box: {  
                        ...prevState.cards_box,          
                        first: null,
                        second:null,
                        third:null,
                    }
             }))
         }
         if(this.state.userId !== id ){
            const {old_check_cards}= this.state
            let latest_old_cards =  old_check_cards.length-1
            const addCards = this.state.latestCards.concat(old_check_cards[latest_old_cards],old_check_cards[latest_old_cards-1])
            this.setState({latestCards:addCards,check_cards:[],})
            this.setState(prevState => ({
                cards_box: {  
                    ...prevState.cards_box,          
                    first: null,
                    second:null,
                    third:null,
                }
         }))
         }
    }//four players playing
    if(this.state.TotalPlayers ===4){
        if(this.state.userId === id){
            const addCards = this.state.latestCards.concat(this.state.check_cards,cards)
            this.setState({latestCards:addCards,check_cards:[],})
            this.setState(prevState => ({
                cards_box: {  
                    ...prevState.cards_box,          
                    first: null,
                    second:null,
                    third:null,
                    fourth:null
                }
         }))
     }
     if(this.state.userId !== id ){
        const {old_check_cards}= this.state
        let latest_old_cards =  old_check_cards.length-1
        const addCards = this.state.latestCards.concat(old_check_cards[latest_old_cards],old_check_cards[latest_old_cards-1])
        this.setState({latestCards:addCards,check_cards:[],})
        this.setState(prevState => ({
            cards_box: {  
                ...prevState.cards_box,          
                first: null,
                second:null,
                third:null,
                fourth:null
            }
     }))
     }
  }
})
}

playing_Two_players(){
        const {first,second}= this.state.cards_box
        if(first!==null && second!==null){
           if(chk_cards(first) !== chk_cards(second)){
               if(this.state.EmptyCards){
                const AddCards = [first,second]
                socket=io(ENDPOINT)  
               socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:this.state.userId,room:this.state.room},()=>{})     
               }
           }
         (two_Players(first,second)===first)?this.setState({checkTurn:0}):this.setState({checkTurn:1}) //setting turn who have largest card
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
        let id = ''
        socket=io(ENDPOINT)   
        if(this.state.EmptyCards){
           if(this.state.checkTurn===0 && first!=null){
            const AddCards = [first,second,third]
            const greaterCard = two_Players(third,second)
            greaterCard===second?id=this.state.players[0][1].id:id=this.state.players[0][2].id
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            }
            else if(this.state.checkTurn===1 && second!=null){
                const AddCards = [first,second,third]
                const greaterCard = two_Players(first,third)
                //bug in this code revise
                greaterCard===first?id=this.state.players[0][0].id:id=this.state.players[0][2].id
                socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            } else if(this.state.checkTurn===2 && third!=null){
                const AddCards = [first,second,third]
                const greaterCard = two_Players(first,second)
                //bug in this code revise
                greaterCard===first?id=this.state.players[0][0].id:id=this.state.players[0][1].id
                socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            }
        }
        if(first!==null && second!==null && third!==null){
            if (three_Players(first,second,third)===first){
                this.setState({checkTurn:0})
            }else if(three_Players(first,second,third)===second){
                this.setState({checkTurn:1})
            }else if(three_Players(first,second,third)===third){
                this.setState({checkTurn:2})
            } //setting turn who have largest card
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
    let id = ''
    socket=io(ENDPOINT)  
    //adding cards to another player if current card not exist
    if(this.state.EmptyCards){
       if(this.state.checkTurn===0 && first!=null){
        const AddCards = [first,second,third,fourth]
        const greaterCard = three_Players(second,third,fourth)  
        greaterCard===second?id=this.state.players[0][1].id:greaterCard===third?id=this.state.players[0][2].id:id=this.state.players[0][3]
        socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
    }
    else if(this.state.checkTurn===1 && second!=null){
            const AddCards = [first,second,third,fourth]
            const greaterCard = three_Players(first,third,fourth)  
            greaterCard===first?id=this.state.players[0][0].id:greaterCard===third?id=this.state.players[0][2].id:id=this.state.players[0][3]
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
    }
    else if(this.state.checkTurn===3 && third!=null){
            const AddCards = [first,second,third,fourth]
            const greaterCard = three_Players(first,second,fourth)            
            greaterCard===first?id=this.state.players[0][0].id:greaterCard===second?id=this.state.players[0][1].id:id=this.state.players[0][3]
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
        }
        else if(this.state.checkTurn===4 && fourth!=null){
            const AddCards = [first,second,third,fourth]
            const greaterCard = three_Players(first,second,third)            
            greaterCard===first?id=this.state.players[0][0].id:greaterCard===second?id=this.state.players[0][1].id:id=this.state.players[0][2]
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
        }
    }
        if(first!==null && second!==null && third!==null && fourth!==null){
        const {first,second,third,fourth}= this.state.cards_box
            if(Four_Players(first,second,third,fourth)===first){
                this.setState({checkTurn:0})
            }else if(Four_Players(first,second,third,fourth)===second){
                this.setState({checkTurn:1})
            }else if(Four_Players(first,second,third,fourth)===third){
                this.setState({checkTurn:2})
            }else if(Four_Players(first,second,third,fourth)===fourth){
                this.setState({checkTurn:3})
            }
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
            if(this.state.userId!==Id){
                const check_cards = availabe_cards(card,this.state.latestCards)
                 
                this.setState({
                    old_check_cards:[...this.state.old_check_cards,check_cards]
                }) //setting cards to another array so that use it when players dont have exact cards

                this.setState({check_cards:check_cards,hideCheckcards:false})
             
                if(check_cards.length===0){
                    console.log("player Number"+this.state.PlayerNumber)
                    this.setState({checkTurn:this.state.PlayerNumber,EmptyCards:true})
                }//two players card logic

            }//setting cards in upper row
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
        //sending card from specific cards with different route in socket
socket.on('send_From_Specific_Cards',({card,Id})=>{
            if(this.state.userId===Id){
             this.setState({hideCheckcards:true})
            }

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
      if(this.state.checkTurn!==this.state.PlayerNumber){
          return 'Another player Turn'
    }
       const Current_Cards = DeleteCard(this.state.latestCards,card)
       this.setState({latestCards:Current_Cards})
       socket =io(ENDPOINT) 
       socket.emit('sendcard',{cardnumber:card,Id:this.state.userId,room:this.state.room})
    }
    
passNewCard=(card)=>{
    const{latestCards}=this.state    
    const Current_Cards = DeleteCard(this.state.check_cards,card)
        //  this.setState({check_cards:Current_Cards})
        const leftCards = [...latestCards,...Current_Cards]
        this.setState({latestCards:leftCards})    
       socket =io(ENDPOINT) 
       socket.emit('send_From_Specific_Cards',{cardnumber:card,Id:this.state.userId,room:this.state.room},()=>{})
    } 

    render() {
        return (  
        <div>
        {/* timmer below */}
        <h1>{this.state.count}</h1>  
        <h2>{this.state.name}</h2>
        <h4>Player turn ={this.state.checkTurn}</h4>
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
            <div className={(this.state.TotalPlayers===2)?"sendCards_from_given_cards":(this.state.TotalPlayers===3?"sendCards_Three_players":"sendCards_Four_players")} hidden={this.state.hideCheckcards}>
                {this.state.check_cards.map((result,index)=>{
                    return(
                        <img className="passNewCard" onClick={()=>this.passNewCard(result)} src={img[result]} key={index}></img>  
                    )
                })}
            </div>
            <div className={this.state.TotalPlayers===2?"container":this.state.TotalPlayers===3?"containerThreePlayer":"containerFourPlayer"} >
           {this.state.latestCards.map((result,index)=>{
             return(
         <img className={this.state.TotalPlayers===2?"cardsImage":(this.state.TotalPlayers===3)?"cardsImageThreePlayer":"cardsImageFourPlayer"} onClick={()=>this.passCard(result)} src={img[result]} key={index}></img> 
               )
            })}
            </div>
            </div>
            // className={!data.completed ? "NotCompleteTask":"TaskComplete"}
        )
    }
}

export default Card
