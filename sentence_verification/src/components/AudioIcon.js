import React from 'react';
import audio_icon from "../assets/images/audio-icon.png"

const AudioIcon = ({ sentence }) => {
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <img
    src={audio_icon}
    alt="audio icon"
      onClick={() => speakText(sentence)}
      style={{ width: '30px', height: '30px', cursor: 'pointer', marginLeft: '0.5vw' }}
    />
  );
};

export default AudioIcon;
