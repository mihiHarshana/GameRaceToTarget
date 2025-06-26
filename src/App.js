import { useState } from 'react';

import FirstPage from './FirstPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GamePage from './GamePage';
import { Col, Row } from 'react-bootstrap';



function App() {

  const [noOfPlayers, setNoOfPlayers] = useState('');
  const [target, setTarget] = useState('');
  const [autoPlayer, setAutoPlayer] = useState(false);


  return (
    <Row className='mt-2'>
      <Col>
          <BrowserRouter>
    <Routes>
      <Route path="/game" exact element={
        <FirstPage setNoOfPlayers={setNoOfPlayers} 
                  setTarget={setTarget}
                  setAutoPlayer={setAutoPlayer}        
          />
        }>
      </Route>
      <Route path="/GamePage" element={
        <GamePage noOfPlayers={noOfPlayers } 
                  target={target} 
                  autoPlayer={autoPlayer}
        />}>
      </Route> 
    </Routes>
    </BrowserRouter>
      </Col>
    </Row>

  )
  
}

export default App;



