import React, { useState } from 'react';
import { SpinLanding } from './components/spin/SpinLanding';
import { MainApp } from './components/spin/MainApp';

function App() {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <>
      {!isStarted ? (
        <SpinLanding onStart={() => setIsStarted(true)} />
      ) : (
        <MainApp onExit={() => setIsStarted(false)} />
      )}
    </>
  );
}

export default App;
