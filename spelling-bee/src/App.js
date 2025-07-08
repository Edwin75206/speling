import React, { useState, useEffect, useRef } from 'react';
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

  // Cronómetro
  const [timer, setTimer] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [timerReady, setTimerReady] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);
  const intervalRef = useRef(null);

  // Carga niveles y animaciones
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

  // Cronómetro (cuenta regresiva)
  useEffect(() => {
    if (timerActive && !timerPaused && timer > 0) {
      intervalRef.current = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    if (timer === 0 && timerActive) {
      setTimerActive(false);
      setTimerPaused(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, timerPaused, timer]);

  // Teclas T y Shift+T para timer (toggle y reiniciar)
  useEffect(() => {
    const handleTimerKey = (e) => {
      if ((e.key === 't' || e.key === 'T')) {
        if (e.shiftKey) {
          // Shift + T = Reinicia cronómetro a 15
          setTimer(15);
          setTimerActive(false);
          setTimerPaused(false);
          setTimerReady(true);
        } else {
          // Solo T
          if (timerReady && !timerActive) {
            setTimerActive(true);
            setTimerReady(false);
            setTimerPaused(false);
          }
          else if (timerActive) {
            if (timerPaused) {
              setTimerPaused(false); // Reanuda
            } else {
              setTimerPaused(true); // Pausa
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleTimerKey);
    return () => window.removeEventListener('keydown', handleTimerKey);
  }, [timerReady, timerActive, timerPaused]);

  // Controles principales
  useEffect(() => {
    const handleKey = async (e) => {
      if (!mode) return;
      const key = e.key.toLowerCase();

      if (key === 'escape') {
        setMode(null);
        setUsed([]);
        setCurrent(null);
        setPrevious(null);
        setTimerActive(false);
        setTimerReady(false);
        setTimerPaused(false);
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
          setTimer(15);
          setTimerActive(false);
          setTimerReady(true);
          setTimerPaused(false);
        } catch (err) {
          console.error('Error getting word:', err);
        }
      } else if (key === 'e') {
        if (!current) return;
        if (view === 'example') {
          setView('word');
        } else {
          const d = await getDetails(mode, current.id);
          setDetails(d);
          setView('example');
        }
      } else if (key === 'd') {
        if (!current) return;
        if (view === 'definition') {
          setView('word');
        } else {
          const d = await getDetails(mode, current.id);
          setDetails(d);
          setView('definition');
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mode, current, previous, used, view]);

  if (!mode) {
    return (
      <div className="app-container home-bg">
        <div className="hex-bg" />
        <header className="app-header"></header>
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
        {/* Instrucciones iniciales */}
        {!current && (
          <>
            <p className="info">Press SPACE or ENTER to begin.</p>
            <div className="instructions-box">
              <h3><FaKeyboard /> Controls</h3>
              <ul>
                <li><strong>Space / Enter</strong> – New word <GiBee /></li>
                <li><strong>E</strong> – Show/hide example <FaBookOpen /></li>
                <li><strong>D</strong> – Show/hide definition <FaLanguage /></li>
                <li><strong>R</strong> – Previous word <FaArrowLeft /></li>
                <li><strong>ESC</strong> – Back to levels</li>
                <li><strong>T</strong> – Start/pause/resume timer (after word appears)</li>
                <li><strong>Shift+T</strong> – Reiniciar cronómetro a 15s</li>
              </ul>
            </div>
          </>
        )}

        {/* Cronómetro solo si hay palabra */}
        {current && (
          <div style={{
            fontSize: '3rem',
            margin: '0.5rem 0 1.2rem 0',
            color: timerActive
              ? (timer <= 5 ? '#d32f2f' : '#007bff')
              : '#888',
            fontWeight: 'bold',
            transition: 'color 0.2s'
          }}>
            {!timerActive && timerReady && (
              <span>
                Presiona <b>T</b> para iniciar: {timer}s
              </span>
            )}
            {timerActive && !timerPaused && (timer > 0 ? `${timer} s` : '¡Tiempo agotado!')}
            {timerActive && timerPaused && (
              <span style={{ color: '#e07b00' }}>⏸ Pausado ({timer} s)</span>
            )}
            {!timerActive && !timerReady && <span style={{ opacity: 0.5 }}>Cronómetro listo</span>}
          </div>
        )}

        {/* Palabra actual */}
        {current && view === 'word' && (
          <>
            <h2 className="word">{current.word}</h2>
            <p className="instructions">Press [T] for timer, [Shift+T] to reset, [E], [D], [R] or [ESC]</p>
          </>
        )}

        {/* Ejemplo o definición */}
        {current && (view === 'example' || view === 'definition') && (
          <>
            <h2 className="word">{current.word}</h2>
            <p className="label">{view === 'example' ? 'Example:' : 'Definition:'}</p>
            <p className="text">{view === 'example' ? details.example : details.definition}</p>
            <p className="instructions">Press [E] or [D] to hide, [Space] for next word, [R] for previous, [ESC] to go back</p>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
