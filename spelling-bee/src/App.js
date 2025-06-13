import React, { useState, useEffect } from 'react';
import { getLevels, getRandomWord, getDetails } from './services/api';
import { FaKeyboard, FaArrowLeft, FaBookOpen, FaLanguage } from 'react-icons/fa';
import { GiBee } from 'react-icons/gi';
import './App.css';
import './HexBackground.css'; // Fondo tipo miel decorativo

function App() {
  const [levels, setLevels] = useState([]);
  const [mode, setMode] = useState(null);
  const [used, setUsed] = useState([]);
  const [previous, setPrevious] = useState(null);
  const [current, setCurrent] = useState(null);
  const [view, setView] = useState('word');
  const [details, setDetails] = useState({});

  useEffect(() => {
    getLevels().then(setLevels);

    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `, styleSheet.cssRules.length);
  }, []);

  useEffect(() => {
    const handleKey = async (e) => {
      if (!mode) return;
      const key = e.key.toLowerCase();

      if (key === 'escape') {
        setMode(null);
        setUsed([]);
        setCurrent(null);
        setPrevious(null);
      } else if (key === 'r') {
        if (previous) {
          setCurrent(previous);
          setView('word');
        }
      } else if (key === ' ' || key === 'enter') {
        e.preventDefault();
        try {
          const w = await getRandomWord(mode);
          if (used.includes(w.id)) return;
          setPrevious(current);
          setUsed(prev => [...prev, w.id]);
          setCurrent(w);
          setView('word');
        } catch (err) {
          console.error('Error getting word:', err);
        }
      } else if (key === 'e') {
        if (!current) return;
        const d = await getDetails(mode, current.id);
        setDetails(d);
        setView('example');
      } else if (key === 'd') {
        if (!current) return;
        const d = await getDetails(mode, current.id);
        setDetails(d);
        setView('definition');
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, current, previous, used]);

  if (!mode) {
    return (
      <div className="app-container">
        <div className="hex-bg" />
        <header className="app-header">
          <img src="./images/logo-idiomas.png" alt="Idiomas Logo" className="logo-coordinacion" />
          <div className="app-title-box">
            <h1 className="app-title">Spelling Bee Contest</h1>
            <p className="app-subtitle">Coordinación de Idiomas - UTXJ</p>
          </div>
          <img src="./images/logo-utxj.png" alt="UTXJ Logo" className="logo-utxj" />
        </header>
        <div className="levels">
          {levels.map(lvl => (
            <button key={lvl} onClick={() => setMode(lvl)} className="level-btn">
              Level {lvl}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="hex-bg" />
      <header className="app-header">
        <img src="./images/logo-idiomas.png" alt="Idiomas Logo" className="logo-coordinacion" />
        <div className="app-title-box">
          <h1 className="app-title">Spelling Level {mode}</h1>
          <p className="app-subtitle">Coordinación de Idiomas - UTXJ</p>
        </div>
        <img src="./images/logo-utxj.png" alt="UTXJ Logo" className="logo-utxj" />
      </header>

      <main className="card expanded">
        {!current && (
          <>
            <p className="info">Press SPACE or ENTER to begin.</p>
            <div className="instructions-box">
              <h3><FaKeyboard /> Controls</h3>
              <ul>
                <li><strong>Space / Enter</strong> – New word <GiBee /></li>
                <li><strong>E</strong> – Show example <FaBookOpen /></li>
                <li><strong>D</strong> – Show definition <FaLanguage /></li>
                <li><strong>R</strong> – Previous word <FaArrowLeft /></li>
                <li><strong>ESC</strong> – Back to levels</li>
              </ul>
            </div>
          </>
        )}

        {current && view === 'word' && (
          <>
            <h2 className="word">{current.word}</h2>
            <p className="instructions">Press [E], [D], [R] or [ESC]</p>
          </>
        )}

        {current && (view === 'example' || view === 'definition') && (
          <>
            <h2 className="word">{current.word}</h2>
            <p className="label">{view === 'example' ? 'Example:' : 'Definition:'}</p>
            <p className="text">{view === 'example' ? details.example : details.definition}</p>
            <p className="instructions">Press [Space] for next word, [R] for previous, [ESC] to go back</p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
