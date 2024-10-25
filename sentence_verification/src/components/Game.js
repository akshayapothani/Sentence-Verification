import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import ProgressBar from './ProgressBar';
import ImageGrid from './ImageGrid';
import AudioIcon from './AudioIcon';
import SummaryScreen from './SummaryScreen';
import './styles.css';
import '../App.css';
import Confetti from 'react-confetti';
import axios from 'axios'; // Import axios for making HTTP requests

function Game() {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [backgroundColors, setBackgroundColors] = useState([]);
  const [shuffledData, setShuffledData] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completionTime, setCompletionTime] = useState(null);
  const [showNextButton, setShowNextButton] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const totalScreens = shuffledData.length;
  const [gameCompleted, setGameCompleted] = useState(false);

  const shuffleArray = (array) => {
    return array.slice().sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/game-data'); // Adjust URL as needed
        const shuffled = response.data.map(item => {
          const shuffledImages = shuffleArray(item.images);
          return { ...item, images: shuffledImages };
        });
        setShuffledData(shuffled);
        setStartTime(Date.now());
      } catch (error) {
        console.error('Error fetching game data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setSelectedImage(null);
    setBackgroundColors([]);
    setShowConfetti(false);
    setFeedbackMessage('');
  }, [currentLevel]);

  useEffect(() => {
    let interval;
    if (startTime !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startTime;
        setElapsedTime(elapsed >= 0 ? elapsed : 0);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  const handleChoice = (chosenImage, index) => {
    setAttempts(attempts + 1);
    const correctAnswer = shuffledData[currentLevel].correctAnswer;
    if (chosenImage === correctAnswer) {
      setShowConfetti(true);
      setFeedbackMessage('Correct');
      const newBackgroundColors = shuffledData[currentLevel].images.map((_, i) =>
        i === index ? 'green' : 'transparent'
      );
      setBackgroundColors(newBackgroundColors);
      setShowNextButton(true);

      if (currentLevel === shuffledData.length - 1) {
        setTimeout(() => {
          setCompletionTime(Date.now() - startTime);
          setGameCompleted(true);
        }, 4000);
      }
    } else {
      setFeedbackMessage('Please, Try Again..');
      const newBackgroundColors = shuffledData[currentLevel].images.map((_, i) =>
        i === index ? '#d63031' : 'transparent'
      );
      setBackgroundColors(newBackgroundColors);
      setTimeout(() => {
        setFeedbackMessage('');
        setBackgroundColors([]);
      }, 2000);
    }
    setSelectedImage(chosenImage);
  };

  const handleNextLevel = () => {
    if (currentLevel + 1 < shuffledData.length) {
      setCurrentLevel(currentLevel + 1);
      setCurrentScreen(currentScreen + 1);
      setSelectedImage(null);
      setBackgroundColors([]);
      setShowConfetti(false);
      setShowNextButton(false);
    }
  };

  const handleNextButtonClick = () => {
    handleNextLevel();
  };

  const handlePlayAgain = () => {
    setCurrentLevel(0);
    setSelectedImage(null);
    setBackgroundColors([]);
    setShowConfetti(false);
    setAttempts(0);
    setStartTime(Date.now());
    setElapsedTime(0);
    setCompletionTime(null);
    setGameCompleted(false);
    setCurrentScreen(1);
    setShowNextButton(false);
  };

  const progressPercentage = (currentScreen / totalScreens) * 100;

  if (gameCompleted) {
    return (
      <SummaryScreen
        totalAttempts={attempts}
        totalElapsedTime={completionTime}
        handlePlayAgain={handlePlayAgain}
      />
    );
  }

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      <Navbar attempts={attempts} elapsedTime={elapsedTime} currentScreen={currentScreen} totalScreens={totalScreens} />
      {showConfetti && <Confetti />}

      {shuffledData.length > 0 && (
        <>
          <ProgressBar progressPercentage={progressPercentage} />

          <div className="transparent-box">
            <AudioIcon sentence={shuffledData[currentLevel].sentence} />
            <div className="sentence">
              {shuffledData[currentLevel].sentence}
            </div>
          </div>

          <div className={`text-center ${feedbackMessage === 'Correct' ? 'correct-blink' :
          feedbackMessage === 'Please, Try Again..' ? 'incorrect-blink':'transparent'}`}

          style={{ backgroundColor: 'rgba(9, 132, 227, 0.5)',padding: '1%', borderRadius: '20px', width: '95%', border: '3px solid #0984e3', boxShadow: '6px 5px 4px #0076a3' }}>
            {feedbackMessage && (
              <div className='feedback-message mt-0' style={{backgroundColor: feedbackMessage === 'Correct' ? 'green' : '#d63031'}}>
                {feedbackMessage}
              </div>
            )}
            <ImageGrid
              images={shuffledData[currentLevel].images}
              screen={shuffledData[currentLevel].screen}
              backgroundColors={backgroundColors}
              handleChoice={handleChoice}
            />

            {showNextButton && currentLevel < shuffledData.length - 1 && (
              <div className="text-center mt-3">
                <button onClick={handleNextButtonClick} className="pushable"> 
                  <span className="front">Next</span>
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Game;



// import React, { useState, useEffect } from 'react';
// import gameData from '../assets/gameData.json';
// import Navbar from './Navbar';
// import ProgressBar from './ProgressBar';
// import ImageGrid from './ImageGrid';
// import AudioIcon from './AudioIcon';
// import SummaryScreen from './SummaryScreen';
// import './styles.css';
// import '../App.css';
// import Confetti from 'react-confetti';


// function Game() {
//   const [currentLevel, setCurrentLevel] = useState(0);
//   const [selectedImage, setSelectedImage] = useState(null);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [backgroundColors, setBackgroundColors] = useState([]);
//   const [shuffledData, setShuffledData] = useState([]);
//   const [attempts, setAttempts] = useState(0);
//   const [startTime, setStartTime] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [completionTime, setCompletionTime] = useState(null);
//   const [showNextButton, setShowNextButton] = useState(false);
//   const [currentScreen, setCurrentScreen] = useState(1);
//   const [feedbackMessage, setFeedbackMessage] = useState('');
//   const totalScreens = shuffledData.length;
//   const [gameCompleted, setGameCompleted] = useState(false);

//   const shuffleArray = (array) => {
//     return array.slice().sort(() => Math.random() - 0.5);
//   };

//   useEffect(() => {
//     const shuffleData = () => {
//       const shuffled = gameData.map(item => {
//         const shuffledImages = shuffleArray(item.images);
//         return { ...item, images: shuffledImages };
//       });
//       setShuffledData(shuffled);
//     };
//     shuffleData();
//     setStartTime(Date.now());
//   }, []);

//   useEffect(() => {
//     setSelectedImage(null);
//     setBackgroundColors([]);
//     setShowConfetti(false);
//     setFeedbackMessage('');
//   }, [currentLevel]);

//   useEffect(() => {
//     let interval;
//     if (startTime !== null) {
//       interval = setInterval(() => {
//         const now = Date.now();
//         const elapsed = now - startTime;
//         setElapsedTime(elapsed >= 0 ? elapsed : 0);
//       }, 1000);
//     }
//     return () => clearInterval(interval);
//   }, [startTime]);

//   const handleChoice = (chosenImage, index) => {
//     setAttempts(attempts + 1);
//     const correctAnswer = shuffledData[currentLevel].correctAnswer;
//     if (chosenImage === correctAnswer) {
//       setShowConfetti(true);
//       setFeedbackMessage('Correct');
//       const newBackgroundColors = shuffledData[currentLevel].images.map((_, i) =>
//         i === index ? 'green' : 'transparent'
//       );
//       setBackgroundColors(newBackgroundColors);
//       setShowNextButton(true);

//       if (currentLevel === shuffledData.length - 1) {
//         setTimeout(() => {
//           setCompletionTime(Date.now() - startTime);
//           setGameCompleted(true);
//         }, 4000);
//       }
//     } else {
//       setFeedbackMessage('Please, Try Again..');
//       const newBackgroundColors = shuffledData[currentLevel].images.map((_, i) =>
//         i === index ? '#d63031' : 'transparent'
//       );
//       setBackgroundColors(newBackgroundColors);
//       setTimeout(() => {
//         setFeedbackMessage('');
//         setBackgroundColors([]);
//       }, 2000);
//     }
//     setSelectedImage(chosenImage);
//   };

//   const handleNextLevel = () => {
//     if (currentLevel + 1 < shuffledData.length) {
//       setCurrentLevel(currentLevel + 1);
//       setCurrentScreen(currentScreen + 1);
//       setSelectedImage(null);
//       setBackgroundColors([]);
//       setShowConfetti(false);
//       setShowNextButton(false);
//     }
//   };

//   const handleNextButtonClick = () => {
//     handleNextLevel();
//   };

//   const handlePlayAgain = () => {
//     setCurrentLevel(0);
//     setSelectedImage(null);
//     setBackgroundColors([]);
//     setShowConfetti(false);
//     setAttempts(0);
//     setStartTime(Date.now());
//     setElapsedTime(0);
//     setCompletionTime(null);
//     setGameCompleted(false);
//     setCurrentScreen(1);
//     setShowNextButton(false);
//   };

//   const progressPercentage = (currentScreen / totalScreens) * 100;

//   if (gameCompleted) {
//     return (
//       <SummaryScreen
//         totalAttempts={attempts}
//         totalElapsedTime={completionTime}
//         handlePlayAgain={handlePlayAgain}
//       />
//     );
//   }

//   return (
//     <div className="game-container" style={{ position: 'relative' }}>
//       <Navbar attempts={attempts} elapsedTime={elapsedTime} currentScreen={currentScreen} totalScreens={totalScreens} />
//       {showConfetti && <Confetti />}

//       {shuffledData.length > 0 && (
//         <>
//           <ProgressBar progressPercentage={progressPercentage} />

//           <div className="transparent-box">
//             <AudioIcon sentence={shuffledData[currentLevel].sentence} />
//             <div className="sentence">
//               {shuffledData[currentLevel].sentence}
//             </div>
//           </div>

//           <div className={`text-center ${feedbackMessage === 'Correct' ? 'correct-blink' :
//           feedbackMessage === 'Please, Try Again..' ? 'incorrect-blink':'transparent'}`}

//           style={{ backgroundColor: 'rgba(9, 132, 227, 0.5)',padding: '1%', borderRadius: '20px', width: '95%', border: '3px solid #0984e3', boxShadow: '6px 5px 4px #0076a3' }}>
//             {feedbackMessage && (
//               <div className='feedback-message mt-0' style={{backgroundColor: feedbackMessage === 'Correct' ? 'green' : '#d63031'}}>
//                 {feedbackMessage}
//               </div>
//             )}
//             <ImageGrid
//               images={shuffledData[currentLevel].images}
//               screen={shuffledData[currentLevel].screen}
//               backgroundColors={backgroundColors}
//               handleChoice={handleChoice}
//             />

//             {showNextButton && currentLevel < shuffledData.length - 1 && (
//               <div className="text-center mt-3">
//                 <button onClick={handleNextButtonClick} className="pushable"> 
//                   <span className="front">Next</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// export default Game;
