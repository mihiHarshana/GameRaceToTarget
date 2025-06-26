import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {useNavigate } from 'react-router-dom';
import { useEffect } from "react";

function GamePage({ noOfPlayers, target, autoPlayer }) {
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [playerValues, setPlayerValues] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [currentPlayerWon, setCurrentPlayerWon] = useState(false);
  const navigator = useNavigate(); 
  const [autoThinking, setAutoThinking] = useState(false);

  const [errors, setErrors] = useState({
    errorAddValue: ''
  });

useEffect(() => {
  const shouldRedirect =
    (autoPlayer && !target) ||
    (!autoPlayer && (!noOfPlayers || !target));

  if (shouldRedirect) {
    navigator('/game');
  }
}, [autoPlayer, noOfPlayers, target, navigator]);

useEffect(() => {
  if (autoPlayer && currentPlayer === 'Auto') {
    setAutoThinking(true); // Start thinking

    const timer = setTimeout(() => {
      const generatedValue = generateAutoValue();
      setInputValue(generatedValue.toString());

      setTimeout(() => {
        handleAdd(generatedValue);
        setAutoThinking(false); // Done thinking
      }, 500);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setAutoThinking(false); // Cleanup in case of unmount
    };
  }
}, [currentPlayer, autoPlayer]);

/*
const generateAutoValue = () => {
  let tempNo = Math.floor(Math.random() * 3) + 1;
  let tempTot = totalScore + tempNo;
  console.log(tempTot);
  console.log('temp no ' + tempNo)
  
  if (tempTot >= target) {
    tempNo=1;
  } 

  console.log(tempNo);
  return  tempNo
} */

const generateAutoValue = () => {
  const remaining = target - totalScore;

  // Win if possible
  if (remaining >= 1 && remaining <= 3) {
    return remaining;
  }

  const safeOptions = [1, 2, 3].filter(n => totalScore + n <= target);

  // Avoid moves that let opponent win next
  const strategicOptions = safeOptions.filter(n => {
    const nextTotal = totalScore + n;
    const opponentCanWin = [1, 2, 3].some(m => nextTotal + m === target);
    return !opponentCanWin;
  });

  const pickRandom = options => {
    const index = Math.floor(Math.random() * options.length);
    return options[index];
  };

  if (strategicOptions.length > 0) {
    return pickRandom(strategicOptions); // random safe & smart
  }

  // No safe strategic moves, just pick random safe one
  return pickRandom(safeOptions);
};


function validateValue(value) {
  const num = Number(value);
  const errorsCopy = { ...errors };

  if (isNaN(num) || num < 1 || num > 3) {
    errorsCopy.errorAddValue = 'Please enter a number between 1 and 3.';
    setErrors(errorsCopy);
    return false;
  }

  errorsCopy.errorAddValue = '';
  setErrors(errorsCopy);
  return true;
}

const handleAdd = (forcedValue = null) => {
  const valueToUse = forcedValue !== null ? Number(forcedValue) : Number(inputValue);

  if (!validateValue(valueToUse)) return;

  const newTotal = totalScore + valueToUse;
  const newHistory = [...playerValues, { player: currentPlayer, value: valueToUse }];

  setPlayerValues(newHistory);
  setTotalScore(newTotal);

  if (newTotal > target) {
    setGameOver(true);
    return;
  }

  if (newTotal === target) {
    setCurrentPlayerWon(true);
    return;
  }

  setInputValue('');

  const nextPlayer = autoPlayer
    ? currentPlayer === 1 ? 'Auto' : 1
    : currentPlayer === noOfPlayers ? 1 : currentPlayer + 1;

  setCurrentPlayer(nextPlayer);
};

  function handleReset (e) {
    e.preventDefault();
     navigator('/game');
  }

  return (
    <Container >
      <h3 className="text-center">🎯 Target: {target}</h3>
      <h4 className="text-center">Total Score: {totalScore}</h4>

      <Row className="justify-content-center">
        <Col md={6} >
          {gameOver ? (
            <div>
            <h2>💥 Game Over! You went over the target. </h2> 
                <Button className= "mt-2 ms-2"  variant="secondary" onClick={handleReset}>
                Re try</Button>
            </div>


          ) : currentPlayerWon ? (
            <div>
            <h2>🏆 Player {currentPlayer} hit the target and wins!</h2>
            <Button className= "mt-2 ms-2"  variant="secondary" onClick={handleReset}>
                Re try</Button>
            </div>

          ) : (
            <Form.Group>
              <Form.Label>
    {autoThinking
    ? '🤖 Auto Player is thinking...'
    : `Player ${currentPlayer}, enter a number (1-3)`}
</Form.Label>
              <Form.Control
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                isInvalid={!!errors.errorAddValue}
              />
              <Form.Control.Feedback type="invalid">
                {errors.errorAddValue}
              </Form.Control.Feedback>
              <Button className="mt-2" variant="primary" onClick={() => handleAdd()}>
                Add
              </Button>
              <Button className= "mt-2 ms-2"  variant="secondary" onClick={handleReset}>
                Reset
              </Button>
            </Form.Group>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default GamePage;
