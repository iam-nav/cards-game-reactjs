import React, { Component } from 'react'
import {Badge,Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

import 'bootstrap/dist/css/bootstrap.min.css';
import {DeleteCard} from './functions/functions'
import './cards.css'
import 'animate.css'
import img from './functions/decksLocation'
import queryString from 'querystring'
import io from 'socket.io-client'
import {chk_cards} from './functions/adding_cards'
import {two_Players,three_Players,Four_Players} from './functions/largest_Cards'
import {availabe_cards,removeFromLatestCards}  from './functions/filter_current_cards'
import {settingPlayers,findingTurn,removeDuplicate} from './functions/playersTurn'
import Congrates from '../Messages/congorates/congratulation'
import PlayerTurn from '../playerturn/playerTurn'
let socket,ENDPOINT = 'https://cardsgame0navjot.herokuapp.com/';
export class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
             box:[],                                                     // cards player shows
             name:'',                                                    //name of the player
             latestCards:[],                                             //cards players have
             img:[],
             room:'',
             TotalPlayers:'',                                            
             displayLoginMsg:true,                                                                 
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
             EmptyCards:false,
             EmptyCards_player:null,
             playerTurn:[],
             hideCardsAnimation:false,
             popupCardsAdd:{
                 msg:'',
                 id:''
             }
        }  
    }

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
    socket.on('pushCardToOpponet',({cards,id,msg})=>{
        //Two Players Playing
        if(this.state.TotalPlayers ===2){
            if(this.state.userId===id){
            this.setState({popupCardsAdd:{msg:msg,id:id}})
            }
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

            if(this.state.EmptyCards){
                console.log('resolve buggy')

            }


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
                 },
                 playerTurn:settingPlayers(this.state.TotalPlayers),
                 check_cards:[],
                 EmptyCards:false,
                 EmptyCards_player:null
          }))
         },1200)
    }
}

playing_Three_players(){
        const {first,second,third}= this.state.cards_box
        let id = ''
        socket=io(ENDPOINT)   
        if(this.state.EmptyCards){
           if(this.state.checkTurn===0 && this.state.EmptyCards_player===0 && first!=null){
            const AddCards = [first,second,third]
            const greaterCard = two_Players(third,second)
            greaterCard===second?id=this.state.players[0][1].id:id=this.state.players[0][2].id
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            }
            else if(this.state.checkTurn===1 && this.state.EmptyCards_player===1 && second!=null){
                const AddCards = [first,second,third]
                const greaterCard = two_Players(first,third)
                //bug in this code revise
                greaterCard===first?id=this.state.players[0][0].id:id=this.state.players[0][2].id
                socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            } else if(this.state.checkTurn===2 && this.state.EmptyCards_player===2 && third!=null){
                const AddCards = [first,second,third]
                const greaterCard = two_Players(first,second)
                //bug in this code revise
                greaterCard===first?id=this.state.players[0][0].id:id=this.state.players[0][1].id
                socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
            }
        }
        if(first!==null && second!==null && third!==null){
            console.log('reached here')
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
                 },
                 playerTurn:settingPlayers(this.state.TotalPlayers),
                 check_cards:[],
                 EmptyCards:false,
                 EmptyCards_player:null
          }))
         },1200)
        }
          }

playing_four_players(){
    const {first,second,third,fourth}= this.state.cards_box
    let id = ''
    socket=io(ENDPOINT)  
    //adding cards to another player if current card not exist
    if(this.state.EmptyCards){
       if(this.state.checkTurn===0 && this.state.EmptyCards_player===0 && first!=null){
        const AddCards = [first,second,third,fourth]
        const greaterCard = three_Players(second,third,fourth)  
        greaterCard===second?id=this.state.players[0][1].id:greaterCard===third?id=this.state.players[0][2].id:id=this.state.players[0][3]
        socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
    }
    else if(this.state.checkTurn===1 && this.state.EmptyCards_player===1 && second!=null){
            const AddCards = [first,second,third,fourth]
            const greaterCard = three_Players(first,third,fourth)  
            greaterCard===first?id=this.state.players[0][0].id:greaterCard===third?id=this.state.players[0][2].id:id=this.state.players[0][3]
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
    }
    else if(this.state.checkTurn===2 && this.state.EmptyCards_player===2 && third!=null){
            const AddCards = [first,second,third,fourth]
            const greaterCard = three_Players(first,second,fourth)            
            greaterCard===first?id=this.state.players[0][0].id:greaterCard===second?id=this.state.players[0][1].id:id=this.state.players[0][3]
            socket.emit('addCardToAnotherPlayer',{cards:AddCards,id:id,room:this.state.room},()=>{})
        }
        else if(this.state.checkTurn===3 && this.state.EmptyCards_player===3 && fourth!=null){
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
                 },
                 playerTurn:settingPlayers(this.state.TotalPlayers),
                 check_cards:[],
                 EmptyCards:false,
                 EmptyCards_player:null
          }))
         },1200)
          }
}
playingGame(){
        socket.on('catchcards',({card,Id,PlayerTurn})=>{
           //setting turns of the player
            const players =removeDuplicate(this.state.playerTurn)
            findingTurn(players,PlayerTurn).then((result)=>{
            if(result.playerTurn===Infinity){
            //     console.log(Infinity)
            //    this.setState({checkTurn:0})
            }else{
                this.setState({
                    playerTurn:result.playersRemaing,
                    checkTurn:result.playerTurn})
            }
        })//setting turns of the player

            if(this.state.userId!==Id){
                const check_cards = availabe_cards(card,this.state.latestCards)
                 
                this.setState({
                    old_check_cards:[...this.state.old_check_cards,check_cards]
                }) //setting cards to another array so that use it when players dont have exact cards

                this.setState({check_cards:check_cards,hideCheckcards:false})
             
                if(check_cards.length===0){
                    console.log("player Number"+this.state.PlayerNumber)
                    
                    
                    //empty card bug issue


                    this.setState({checkTurn:this.state.PlayerNumber,EmptyCards:true,EmptyCards_player:this.state.PlayerNumber})
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
socket.on('send_From_Specific_Cards',({card,Id,PlayerTurn})=>{

    const players =removeDuplicate(this.state.playerTurn)
    console.log(PlayerTurn)
    findingTurn(players,PlayerTurn).then((result)=>{
        if(result.playerTurn===Infinity){
            return 'all players have their turn'
            }else{
                this.setState({
                    playerTurn:result.playersRemaing,
                    checkTurn:result.playerTurn})
            }
})


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
            PlayerNumber:Player_number,
            playerTurn:settingPlayers(players.length)
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
       socket.emit('sendcard',{cardnumber:card,Id:this.state.userId,room:this.state.room,PlayerTurn:this.state.PlayerNumber})
    }
    
passNewCard=(card)=>{
    console.log('rached'+card)
    if(this.state.checkTurn!==this.state.PlayerNumber){
        return 'Another player Turn'
  }
    const{latestCards}=this.state    
    const Current_Cards = DeleteCard(this.state.check_cards,card)
        const leftCards = [...latestCards,...Current_Cards]
        this.setState({latestCards:leftCards})    
       socket =io(ENDPOINT) 
       socket.emit('send_From_Specific_Cards',{cardnumber:card,Id:this.state.userId,room:this.state.room,PlayerTurn:this.state.PlayerNumber},()=>{})
    } 
    render() {
        return (  
        <div>
         {(this.state.latestCards.length===0)?<Congrates name={this.state.name}></Congrates>:null}
            <PlayerTurn name={this.state.checkTurn} players={this.state.players}></PlayerTurn>
           <h2>{this.state.name}</h2>
            <div className="Connected">  
           <ul>        
        <li id="user"> <Avatar size={30} style={{ backgroundColor: '#FC4445',position:"fixed",right:'13.5%',top:"13%" }} icon={<UserOutlined />} />{(this.state.players.length>0)?this.state.players[0][this.state.PlayerNumber].name:null}   <Badge color="magenta" /></li>
           </ul>



         <ol className="Connected_table"> 
         <tr> 
        <h6 style={{opacity:"10",color:'#05396B',fontSize:"18px",marginLeft:"-29px",fontStyle:"bold" }}>Joined Players <Badge count={this.state.TotalPlayers} /></h6>   
        </tr>
            {this.state.players.map((row)=>{
               return row.map((result)=>{
               return <li style={{marginLeft:"-10px",padding:"2px"}}><Avatar size="small"  style={{ backgroundColor: '#05396B',position:"fixed",left:"10px" }} icon={<UserOutlined />} />{result.name} <Badge status="processing"/></li>
                })
            })}
        </ol>
            </div>
            <div id="boxContainer">
            <img className="boxCards" src={img[this.state.cards_box.first]} alt=""></img> 
            <img className="second_boxCards" src={img[this.state.cards_box.second]} alt=""></img> 
            <img className="third_boxCards" src={img[this.state.cards_box.third]} alt=""></img> 
            <img className="fourth_boxCards" src={img[this.state.cards_box.fourth]} alt=""></img>             
            </div>     
            <div className={(this.state.TotalPlayers===2)?"sendCards_from_given_cards":(this.state.TotalPlayers===3?"sendCards_Three_players":"sendCards_Four_players")} hidden={this.state.hideCheckcards}>
                {this.state.check_cards.map((result,index)=>{
                    return(
                        <img className="animate__animated animate__backInLeft" onClick={()=>this.passNewCard(result)} src={img[result]} key={index} alt=""></img>  
                    )
                })}
            </div>
            <div className={this.state.TotalPlayers===2?"container":this.state.TotalPlayers===3?"containerThreePlayer":"containerFourPlayer"} >
           {this.state.latestCards.map((result,index)=>{
               if(this.state.check_cards.length>0){
                return<img className={this.state.TotalPlayers===2?"animate__animated animate__fadeOutBottomRight":(this.state.TotalPlayers===3)?"animate__animated animate__fadeOutBottomRight":"animate__animated animate__fadeOutBottomRight"}
                src={img[result]} key={index} alt=""></img>
            }else{
                return<img className={this.state.TotalPlayers===2?"animate__animated animate__fadeInBottomRight":(this.state.TotalPlayers===3)?"animate__animated animate__fadeInBottomRight":"animate__animated animate__fadeInBottomRight cardsImageFourPlayer"}
                onClick={()=>this.passCard(result)} src={img[result]} key={index}  alt=""></img>  
            }
        })
            
            }


            </div>
            </div>
            // className={!data.completed ? "NotCompleteTask":"TaskComplete"}
        )
    }
}

export default Card
