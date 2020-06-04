import React from 'react'
import {FormControl,Button,Nav,Navbar,Form} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../images/cards-Logo.jpg'

export default function header() {
    return (
        <div>
              <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="#home"> <img src={logo} style={{height:"40px",borderRadius:"20px"}}></img></Navbar.Brand>
    <Nav className="mr-auto">
      <Nav.Link href="#home">Home</Nav.Link>
      <Nav.Link href="#features">About</Nav.Link>
      <Nav.Link href="#pricing">Help</Nav.Link>
    </Nav>
  </Navbar>
        </div>
    )
}
