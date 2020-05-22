import React,{useState} from 'react';
import {Link} from 'react-router-dom';
import {Form,Button} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

const Join = ()=>{
  const randomRoom =Math.random(4).toString(36).slice(2)
const [name,setName] = useState('')
const [room,setRoom] = useState(randomRoom)
const [hideform,setHideform] = useState(true)
const [disableCreatebtn,setDisableCreatebtn] = useState(false)
const [disableJoinbtn,setDisableJoinbtn] = useState(true)
const [creteSwitch,setCreteSwitch] = useState(true)
const [joinSwitch,setJoinSwitch] = useState(true)

function setforms(){
  setHideform(false)
  setDisableCreatebtn(true)
  setCreteSwitch(false)
  setJoinSwitch(true)
}
function JoinGroup(){
  setHideform(false)
  setDisableJoinbtn(false)
  setJoinSwitch(false)
  setCreteSwitch(true)
}

function sendRoom(){
}

return(
  <div>
     <Button variant="primary" onClick={setforms} type="submit" disabled={disableCreatebtn}>
    Create Room
  </Button>
  <Button variant="danger" type="submit" onClick={JoinGroup} >
    Join Room
  </Button>

    <Form style={{width:"500px",marginLeft:"30%"}} hidden={hideform}>
  <Form.Group controlId="formBasicEmail">
    <Form.Label>Name</Form.Label>
    <Form.Control type="name" placeholder="Enter UserName" onChange={(event)=>setName(event.target.value)} />
  </Form.Group>

  <Form.Group controlId="formBasicPassword" hidden={disableJoinbtn}>
    <Form.Label>Room Name</Form.Label>
    <Form.Control type="name" placeholder="Room Name" onChange={(event)=>setRoom(event.target.value)}/>
  </Form.Group>
  <Link onClick ={event => (!name || !room) ? event.preventDefault():null} to={`/create?&name=${name}&room=${room}`}>
  <Button variant="primary" type="submit" hidden={creteSwitch}>
    Create Room
  </Button>
  </Link>
  <Link onClick ={event => (!name || !room) ? event.preventDefault():null} to={`/join?&name=${name}&room=${room}`}>
  <Button variant="primary" type="submit" hidden={joinSwitch}>
    Join Room
  </Button>
  </Link>


</Form>
 
</div>
    )
}

export default Join