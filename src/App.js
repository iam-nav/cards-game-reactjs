import React from 'react'
import  {BrowserRouter as Router,Route} from 'react-router-dom'

import join from './components/join'
import chat from './components/chat'
import cards from './components/cards/card';
import create from './components/createRoom'
import joinRoom from './components/joinRoom'

const app= ()=>(
    
<Router>
    <Route path="/" exact component={join} />
    <Route path="/chat" component={cards} />
    <Route path="/create" component={create}/>
    <Route path="/join" component={joinRoom}/>
</Router>
);

export default app;