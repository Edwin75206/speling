/**
 * Backend Spelling Bee
 * -------------------
 * Node.js + Express + MySQL
 *
 * Antes de usar:
 * 1. Crea la vista `spelling_all` en MySQL (une a2spelling y b1spelling):
 *
 *    CREATE OR REPLACE VIEW db_spelling.spelling_all AS
 *    SELECT 'A2' AS level, Num AS id, WORD AS word, DEFINITION AS definition, EXAMPLE AS example FROM a2spelling
 *    UNION ALL
 *    SELECT 'B1' AS level, Num AS id, WORD AS word, DEFINITION AS definition, EXAMPLE AS example FROM b1spelling;
 *
 * 2. Instala dependencias:
 *    npm install express mysql2 cors
 */

const express = require('express');
const mysql   = require('mysql2/promise');
const cors    = require('cors');

const app  = express();
const PORT = 4000;

// Configuración de la conexión MySQL (ajusta el puerto a 3308 si tu servidor MySQL corre en ese puerto)
const pool = mysql.createPool({
  host:            'localhost',    // o 'localhost'
  port:            3307,           // Puerto donde escucha tu MySQL
  user:            'root',         // Cambia a tu usuario
  password:        'Pancho123',             // Cambia a tu contraseña si aplica
  database:        'db_spelling',
  waitForConnections: true,
  connectionLimit:    10
});

app.use(cors());
app.use(express.json());

// 1) Endpoint: niveles disponibles
app.get('/api/levels', (req, res) => {
  res.json(['A2', 'B1']);
});

// 2) Endpoint: palabra aleatoria para un nivel
app.get('/api/random/:level', async (req, res) => {
  try {
    const lvl = req.params.level.toUpperCase();
    const [rows] = await pool.query(
      `SELECT id, word
       FROM spelling_all
       WHERE level = ?
       ORDER BY RAND()
       LIMIT 1`,
      [lvl]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'Sin palabras' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// 3) Endpoint: detalles (definición + ejemplo) de una palabra
app.get('/api/details/:level/:id', async (req, res) => {
  try {
    const { level, id } = req.params;
    const [rows] = await pool.query(
      `SELECT definition, example
       FROM spelling_all
       WHERE level = ? AND id = ?
       LIMIT 1`,
      [level.toUpperCase(), id]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Inicia el servidor
app.listen(PORT, 'localhost', () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});


