
import React, { useState, useEffect } from 'react';
import { getLevels, getRandomWord, getDetails } from './services/api';

function App() {
  const [levels, setLevels]   = useState([]);
  const [mode, setMode]       = useState(null);
  const [used, setUsed]       = useState([]);
  const [current, setCurrent] = useState(null);
  const [view, setView]       = useState('word'); // 'word' | 'example' | 'definition'
  const [details, setDetails] = useState({});

  useEffect(() => {
    getLevels().then(setLevels);
  }, []);

  const nextWord = async () => {
    const w = await getRandomWord(mode);
    if (used.includes(w.id)) return nextWord();
    setUsed(prev => [...prev, w.id]);
    setCurrent(w);
    setView('word');
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
        <h1>Spelling Bee</h1>
        {levels.map(lvl => (
          <button key={lvl} onClick={() => setMode(lvl)} style={styles.btn}>
            Spelling {lvl}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div style={styles.center}>
      <h1>Spelling {mode}</h1>
      <div style={styles.row}>
        <button onClick={nextWord}>Nueva palabra</button>
        <button onClick={showExample} disabled={!current}>Ejemplo</button>
        <button onClick={showDefinition} disabled={!current}>Definición</button>
      </div>
      <div style={styles.card}>
        {!current && <p>Pulsa “Nueva palabra” para comenzar.</p>}
        {current && view === 'word' && <h2>{current.word}</h2>}
        {current && view === 'example' && <p><strong>Ejemplo:</strong> {details.example}</p>}
        {current && view === 'definition' && <p><strong>Definición:</strong> {details.definition}</p>}
      </div>
      <button onClick={() => {
        setMode(null);
        setUsed([]);
        setCurrent(null);
      }}>← Volver</button>
    </div>
  );
}

const styles = {
  center: { textAlign: 'center', padding: 20, fontFamily: 'sans-serif' },
  btn:    { margin: '0.5rem', padding: '0.75rem 1.5rem', fontSize: '1rem' },
  row:    { display: 'flex', justifyContent: 'center', gap: '1rem', margin: '1rem 0' },
  card:   { border: '1px solid #ccc', borderRadius: 8, padding: 20, minHeight: 80, maxWidth: 320, margin: 'auto' }
};

export default App;

