import React,{useState,useEffect} from 'react';
import queryString from 'querystring'
import io from 'socket.io-client'

let socket,ENDPOINT = 'localhost:3001';

const Chat = ({location})=>{
    const [name,setName]= useState('')
    const [room,setRoom]= useState('')
    const [message,setMessage] =useState('')
    const [messages,setMessages] =useState([''])
    useEffect(()=>{
        const data = queryString.parse(location.search)
         setName(data.name) 
         setRoom(data.room)
         socket =io(ENDPOINT)
         socket.emit('join',{name:data.name,room:data.room},()=>{

         })
         socket.on('message',({text})=>{
             console.log(text)
            setMessages(text)
         })
         socket.on('Messg',({text})=>{
            console.log(text)
           setMessages(text)
        })
         return ()=>{
             socket.emit('disconnect');
             socket.off();
         }
         console.log(socket)
    },[ENDPOINT,location.search])

    const enter=(event)=>{
        socket =io(ENDPOINT)
        console.log(message)
        socket.emit('msg',{msg:message},()=>{})
    }
    return(
        <div>
    <h1>chat {name}</h1>
    <input type="text" onChange={(event)=> setMessage(event.target.value)}></input>
    <button onClick={enter}>click me</button>
    <p>{messages}</p>
    </div>
    
    )
}

export default Chat