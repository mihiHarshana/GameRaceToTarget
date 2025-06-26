import { useState } from 'react';

import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import {useNavigate } from 'react-router-dom';

function FirstPage ({setNoOfPlayers, setTarget, setAutoPlayer}) {
//const [target, setTarget] = useState(21);
const [localNoOfPlayers, setLocalNoOfPlayers] = useState('');
const [localTargetValue, setLocalTargetValue] = useState('');
const [localAutoPlayer, setLocalAutoPlyer] = useState(false);

const [errors, setErrors] = useState({
    errorNoOfPlayers: '',
    errorTargetValue: ''
})

const navigator = useNavigate(); 


function handleStartGame(e) {
  e.preventDefault();

if (validateForm()) {
  setNoOfPlayers(Number(localNoOfPlayers));
  setTarget(Number(localTargetValue));
  setAutoPlayer(localAutoPlayer);
  navigator('/GamePage');
}
}

function validateForm() {
  let valid = true;
  const errorsCopy = { ...errors };

  const targetNumber = Number(localTargetValue);
  const playerCount = Number(localNoOfPlayers);

  if (!localTargetValue || isNaN(targetNumber) || targetNumber < 11) {
    errorsCopy.errorTargetValue = 'Enter a valid target value (min 11).';
    valid = false;
  } else {
    errorsCopy.errorTargetValue = '';
  }

  if (!localAutoPlayer) {
    if (!localNoOfPlayers || isNaN(playerCount) || playerCount < 2) {
      errorsCopy.errorNoOfPlayers = 'Enter number of players (at least 2).';
      valid = false;
    } else {
      errorsCopy.errorNoOfPlayers = '';
    }
  } else {
    errorsCopy.errorNoOfPlayers = '';
  }

  setErrors(errorsCopy);
  return valid;
}


const handleAutoPlayerChange = (event) => {
  const isChecked = event.target.checked;
  setLocalAutoPlyer(isChecked);
  setAutoPlayer(isChecked);
};

return (
<Container>
  <Row className="justify-content-center">
    <Col md={6}>
      <Card>
        <h1 className='text-center'>Welcome to Race to the Target</h1>
      </Card>
  
    </Col>
  </Row>

  <Row className="justify-content-center">
    <Col md={6}>
      <Card>
        <Card.Header as="h5">Instructions </Card.Header>
          <Card.Body>
            <Card.Text>
                Step into the arena where every move could be your last!
Players take turns pumping the score by 1, 2, or 3, racing to hit the exact target number.

Land perfectly on the target? 🔥 You win and light up the board!

Go over? 💥 Game over—you crash and burn.
There are no second tries. No do-overs. Just pure arcade tension and strategic showdowns.
Push your luck, outplay your rival, and hit the target with style!
            </Card.Text>
          </Card.Body>
      </Card>
  
    </Col>
  </Row>
  <Row className="justify-content-center">
      <Col md={6}>
        <Card>
        <Card.Header as="h5">Set Game Parameters  </Card.Header>
          <Card.Body>
            <Card.Text>
            <Form>
            <Row>
              <Col>
              <Form.Group className="mb-3" controlId="formSetValues">
              <Form.Label>Enter Target </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter Target Value"
                 min={11}
                 value={localTargetValue}
                 onChange={(e) => setLocalTargetValue(Number(e.target.value))}
                  className={`form-control ${errors.errorTargetValue ? 'is-invalid' : ''}`}/>
                 {errors.errorTargetValue && <div className='invalid-feedback'>{errors.errorTargetValue}</div>}
              

            </Form.Group>
              </Col>
              <Col>
              <Form.Group className="mb-3" controlId="formSetNoOfPlayers">
              <Form.Label>Enter No of Players</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={20}
                placeholder="Enter number of players"
                value={localNoOfPlayers}
                disabled={localAutoPlayer} 
                onChange={(e) => setLocalNoOfPlayers(Number(e.target.value))}
                className={`form-control ${errors.errorNoOfPlayers ? 'is-invalid' : ''}`}/>
                 {errors.errorNoOfPlayers && <div className='invalid-feedback'>{errors.errorNoOfPlayers}</div>}

            </Form.Group>
              </Col>
            </Row>
            <Row>
                <Col>
                  <Form.Check
                    type="switch"
                    id="switchAutoPlayer"
                    label="Auto Player"
                    checked={localAutoPlayer}
                    onChange={handleAutoPlayerChange}
                  />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className='primary' onClick={handleStartGame}>Start</Button>
                </Col>
            </Row>
            </Form>
            </Card.Text>
          </Card.Body>
      </Card>
      </Col>
  </Row>

</Container>

)


}

export default FirstPage;