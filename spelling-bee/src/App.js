import React, { useState, useEffect } from 'react';
import { getLevels, getRandomWord, getDetails } from './services/api';

function App() {
  const [levels, setLevels] = useState([]);
  const [mode, setMode] = useState(null);
  const [used, setUsed] = useState([]);
  const [current, setCurrent] = useState(null);
  const [view, setView] = useState('word');
  const [details, setDetails] = useState({});

  useEffect(() => {
    getLevels().then(setLevels);
  }, []);

  const nextWord = async () => {
    try {
      const w = await getRandomWord(mode);
      if (used.includes(w.id)) return nextWord();
      setUsed(prev => [...prev, w.id]);
      setCurrent(w);
      setView('word');
    } catch (e) {
      console.error('Error al pedir palabra:', e.response?.data || e.message || e);
    }
  };

  const showExample = async () => {
    if (!current) return;
    const d = await getDetails(mode, current.id);
    setDetails(d);
    setView('example');
  };

  const showDefinition = async () => {
    if (!current) return;
    const d = await getDetails(mode, current.id);
    setDetails(d);
    setView('definition');
  };

  if (!mode) {
    return (
      <div style={styles.center}>
        <h1 style={styles.title}>Spelling Bee</h1>
        {levels.map(lvl => (
          <button key={lvl} onClick={() => setMode(lvl)} style={styles.btn}>
            Nivel {lvl}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <h1 style={styles.title}>Spelling Nivel {mode}</h1>

      <div style={styles.card}>
        {!current && <p style={styles.info}>Haz clic en “Nueva palabra” para comenzar.</p>}

        {current && view === 'word' && (
          <h2 style={styles.word}>{current.word}</h2>
        )}

        {current && (view === 'example' || view === 'definition') && (
          <>
            <h2 style={styles.word}>{current.word}</h2>
            <p style={styles.label}>
              {view === 'example' ? 'Ejemplo:' : 'Definición:'}
            </p>
            <p style={styles.text}>
              {view === 'example' ? details.example : details.definition}
            </p>
          </>
        )}
      </div>

      <div style={styles.row}>
        <button onClick={nextWord} style={styles.control}>🆕 Nueva palabra</button>
        <button onClick={showExample} disabled={!current} style={styles.control}>📘 Ejemplo</button>
        <button onClick={showDefinition} disabled={!current} style={styles.control}>📖 Definición</button>
      </div>

      <button onClick={() => {
        setMode(null);
        setUsed([]);
        setCurrent(null);
      }} style={styles.back}>← Volver a niveles</button>
    </div>
  );
}

const styles = {
  center: {
    textAlign: 'center',
    padding: '2rem',
    fontFamily: '"Segoe UI", sans-serif',
    background: '#f7faff',
    minHeight: '100vh'
  },
  title: {
    fontSize: '4rem',
    color: '#1a1a1a',
    marginBottom: '1.5rem',
    marginTop: '0.5rem'
  },
  btn: {
    margin: '1rem',
    padding: '1rem 2rem',
    fontSize: '1.5rem',
    borderRadius: '1rem',
    border: 'none',
    cursor: 'pointer',
    background: '#1976D2',
    color: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
  },
  back: {
    marginTop: '2rem',
    background: 'transparent',
    border: 'none',
    color: '#1976D2',
    cursor: 'pointer',
    fontSize: '1.2rem'
  },
  row: {
    display: 'flex',
    justifyContent: 'center',
    gap: '2rem',
    marginTop: '1.5rem',
    flexWrap: 'wrap'
  },
  control: {
    padding: '1rem 2rem',
    fontSize: '1.4rem',
    borderRadius: '0.8rem',
    border: 'none',
    background: '#4caf50',
    color: 'white',
    cursor: 'pointer',
    minWidth: '200px'
  },
  card: {
    background: '#ffffff',
    borderRadius: '1.5rem',
    padding: '2rem',
    maxWidth: '900px',
    margin: 'auto',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    minHeight: '300px',
    transition: 'all 0.3s ease-in-out'
  },
  word: {
    fontSize: '6rem',
    margin: '1rem 0',
    color: '#222'
  },
  label: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: '2rem',
    color: '#444'
  },
  text: {
    fontSize: '1.8rem',
    lineHeight: '1.6',
    marginTop: '1rem',
    color: '#555'
  },
  info: {
    fontSize: '1.6rem',
    color: '#777'
  }
};

export default App;
