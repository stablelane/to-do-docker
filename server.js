import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'

const app = express()
const sqlite = sqlite3.verbose()

const db = new sqlite.Database('./test.db',sqlite.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message)
})

app.use(cors())
app.use(express.json())
// create a table
db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY,
        text TEXT NOT NULL
      )
    `);
    console.log("Table 'todos' created successfully.");
  });
  app.get('/', (req,res) => {
    //send all the todo's 
    console.log('trigger')
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({ todos: rows });
      });
})
app.post('/create/:id', (req,res) => {
    // create with id params
    const {id} = req.params
    const {text} = req.body
    if (!text) return res.send("text is required")
    db.run(`INSERT INTO todos (id, text) VALUES (?, ?)`, [id, text], function (err) {
        if (err) {
          return res.status(500).send(err);
        }
        res.send('Todo created successfully');
      });
})
app.delete('/delete/:id', (req,res) => {
    // delete with id params
    const {id} = req.params
    db.run(`DELETE FROM todos WHERE id = ?`, [id], function (err) {
        if (err) {
          return res.status(500).send('Error deleting todo');
        }
        if (this.changes === 0) {
          return res.status(404).send('Todo not found');
        }
        res.send('Todo deleted successfully');
      });
})

app.listen(5000)