import React from 'react'
import  {BrowserRouter as Router,Route} from 'react-router-dom'

import join from './components/join'
import cards from './components/cards/card';
import create from './components/createRoom'
import joinRoom from './components/joinRoom'
import Header from './components/layout/header'
import Footer from './components/layout/footer'
const app= ()=>(
    
<Router>
<div>
<Header></Header>
    <Route path="/" exact component={join} />
    <Route path="/chat" component={cards} />
    <Route path="/create" component={create}/>
    <Route path="/join" component={joinRoom}/>
    <Footer></Footer>
    </div>
</Router>
);

export default app;