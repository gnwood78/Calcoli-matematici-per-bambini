
import React, { useState, useEffect } from "react";
import { FaSmile, FaCog, FaBook } from "react-icons/fa";
import "./App.css";

const gradeNames = [
  "Prima elementare",
  "Seconda elementare",
  "Terza elementare",
  "Quarta elementare",
  "Quinta elementare"
];

const REQUIRED_CORRECT = 10;

const App = () => {
  const [settingMode, setSettingMode] = useState(true);
  const [selectedOperations, setSelectedOperations] = useState({
    "+": true,
    "-": true,
    "*": false,
    "/": false
  });

  const [level, setLevel] = useState(1);
  const [numbers, setNumbers] = useState([]);
  const [operators, setOperators] = useState([]);
  const [expressionString, setExpressionString] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [fade, setFade] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const positiveMessages = [
    "Perfetto!",
    "Ottimo lavoro!",
    "Bravo!",
    "Ben fatto!",
    "Continua così!"
  ];
  const negativeMessage = "Ops! Riprova!";

  const getAvailableChainOps = () => {
    const ops = Object.keys(selectedOperations).filter((op) => selectedOperations[op]);
    const chainOps = ops.filter((op) => op === "+" || op === "-" || op === "*");
    if (chainOps.length === 0) {
      chainOps.push("+");
    }
    return chainOps;
  };

  const generateQuestion = () => {
    const gradeIndex = Math.min(Math.floor((level - 1) / 10), gradeNames.length - 1);
    let chainLength;
    let maxNumber;

    if (level < 5) {
      maxNumber = 10;
      chainLength = 2;
    } else if (level <= 10) {
      maxNumber = 20;
      chainLength = Math.floor(Math.random() * 2) + 2; // 2 o 3 numeri
    } else {
      chainLength = Math.floor(Math.random() * 2) + 2;
      maxNumber = 100;
    }

    const newNumbers = [];
    const chainOpsPool = getAvailableChainOps();
    const newOperators = [];
    
    const op = chainOpsPool[Math.floor(Math.random() * chainOpsPool.length)];
    newOperators.push(op);
    
    if (level > 10) {
      if (op === "+") {
        const choices = [
          () => Math.floor(Math.random() * 9) + 1,
          () => Math.floor(Math.random() * 90) + 10,
          () => Math.floor(Math.random() * 900) + 100
        ];
        
        for (let i = 0; i < chainLength; i++) {
          let nextNum;
          do {
            nextNum = choices[Math.floor(Math.random() * choices.length)]();
          } while (newNumbers.includes(nextNum));
          newNumbers.push(nextNum);
        }
      } else if (op === "-") {
        maxNumber = 100;
        newNumbers.push(maxNumber);
        let subtractor = Math.floor(Math.random() * (maxNumber - 1)) + 1;
        newNumbers.push(subtractor);
        chainLength = 2;
      }
    }
    
    if (newNumbers.length === 0) {
      for (let i = 0; i < chainLength; i++) {
        newNumbers.push(Math.floor(Math.random() * maxNumber) + 1);
      }
    }

    let exprString = "" + newNumbers[0];
    let result = newNumbers[0];
    
    for (let i = 0; i < newOperators.length; i++) {
      if (newOperators[i] === "-") {
        let temp = Math.min(result, newNumbers[i + 1]);
        newNumbers[i + 1] = temp;
      }
      exprString += " " + newOperators[i] + " " + newNumbers[i + 1];
      switch (newOperators[i]) {
        case "+":
          result += newNumbers[i + 1];
          break;
        case "-":
          result -= newNumbers[i + 1];
          break;
        case "*":
          result *= newNumbers[i + 1];
          break;
        default:
          break;
      }
    }

    setNumbers(newNumbers);
    setOperators(newOperators);
    setExpressionString(exprString);
    setCorrectAnswer(result);
    setUserAnswer("");
    setFade(true);
    setTimeout(() => setFade(false), 500);
  };

  useEffect(() => {
    if (!settingMode && !completed) {
      generateQuestion();
    }
  }, [level, settingMode, completed, selectedOperations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parseFloat(userAnswer) === correctAnswer) {
      const newCount = correctCount + 1;
      if (newCount < REQUIRED_CORRECT) {
        const msg = `Operazione ${newCount} di ${REQUIRED_CORRECT} completata! ${positiveMessages[Math.floor(Math.random() * positiveMessages.length)]}`;
        setFeedback(msg);
        setTimeout(() => {
          setFeedback("");
          setCorrectCount(newCount);
          generateQuestion();
        }, 1500);
      } else {
        if (level >= 50) {
          setFeedback("Complimenti, hai completato il gioco!");
          setCompleted(true);
        } else {
          const msg = `Complimenti! Hai completato il livello ${level}! Passiamo al livello ${level + 1}. ${positiveMessages[Math.floor(Math.random() * positiveMessages.length)]}`;
          setFeedback(msg);
          setTimeout(() => {
            setFeedback("");
            setCorrectCount(0);
            setLevel(prevLevel => prevLevel + 1);
          }, 1500);
        }
      }
    } else {
      setFeedback(negativeMessage);
      setTimeout(() => {
        setFeedback("");
        setLevel(1);
        setCorrectCount(0);
      }, 1500);
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOperations((prev) => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSaveSettings = () => {
    const available = Object.keys(selectedOperations).filter((op) => selectedOperations[op]);
    if (available.length === 0) {
      alert("Seleziona almeno un'operazione!");
      return;
    }
    setSettingMode(false);
    setLevel(1);
    setCompleted(false);
    setCorrectCount(0);
  };

  const handleRestart = () => {
    setLevel(1);
    setCompleted(false);
    setFeedback("");
    setCorrectCount(0);
  };

  const gradeIndex = Math.min(Math.floor((level - 1) / 10), gradeNames.length - 1);
  const currentGradeName = gradeNames[gradeIndex];

  return (
    <div className="container">
      {settingMode ? (
        <div className="settings-card">
          <header className="settings-header">
            <FaCog className="settings-icon" />
            <h1>Impostazioni</h1>
          </header>
          <div className="guide">
            <FaBook className="guide-icon" />
            <p className="guide-text">
              Benvenuto! In questo gioco matematico dovrai risolvere delle operazioni adatte alla tua classe. Per ogni livello dovrai completare correttamente 10 operazioni. Le operazioni diventano gradualmente più complesse: ogni 10 livelli aumenta il numero di operazioni da svolgere insieme. Non preoccuparti delle sottrazioni: abbiamo fatto in modo che i risultati siano sempre positivi! Se sbagli, ricominci dal livello 1. Buon divertimento!
            </p>
          </div>
          <div className="settings-content">
            <p>Seleziona le operazioni da svolgere:</p>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="+"
                  checked={selectedOperations["+"]}
                  onChange={handleCheckboxChange}
                />
                Somma (+)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="-"
                  checked={selectedOperations["-"]}
                  onChange={handleCheckboxChange}
                />
                Sottrazione (-)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="*"
                  checked={selectedOperations["*"]}
                  onChange={handleCheckboxChange}
                />
                Moltiplicazione (*)
              </label>
              <label>
                <input
                  type="checkbox"
                  name="/"
                  checked={selectedOperations["/"]}
                  onChange={handleCheckboxChange}
                />
                Divisione (/)
              </label>
            </div>
            <button className="btn-save" onClick={handleSaveSettings}>
              Salva Impostazioni
            </button>
          </div>
        </div>
      ) : (
        <div className="game-card">
          <header className="card-header">
            <FaSmile className="icon" />
            <h1>Calcoli per Bambini</h1>
          </header>
          <div className={`content ${fade ? "fade-in" : ""}`}>
            <div className="level-and-settings">
              <h2>{currentGradeName}</h2>
              <button className="btn-settings" onClick={() => setSettingMode(true)}>
                Modifica Impostazioni
              </button>
            </div>
            <p className="progress">
              Livello {level} - Operazione {correctCount + 1} di {REQUIRED_CORRECT}
            </p>
            <p className="question">
              Risolvi: <span className="expression">{expressionString}</span>
            </p>
            <form onSubmit={handleSubmit} className="answer-form">
              <input
                type="number"
                className="input-answer"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={feedback !== ""}
                autoFocus
              />
              <button type="submit" className="btn-submit" disabled={feedback !== ""}>
                Verifica
              </button>
            </form>
            {feedback && (
              <div className="feedback">
                <FaSmile className="feedback-icon" />
                <p className="feedback-message">{feedback}</p>
              </div>
            )}
            {completed && (
              <button className="btn-save" onClick={handleRestart}>
                Riavvia
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
