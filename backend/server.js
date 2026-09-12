const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();
app.use(cors());
app.use(express.json());

app.get('/tickets', (req, res) => {
    const tickets = db.prepare('SELECT * FROM tickets').all();
    res.json(tickets);
});

app.post('/tickets', (req, res) => {
    const code  = require('crypto').randomBytes(4).toString('hex');
    const stmt = db.prepare('INSERT INTO tickets (code) VALUES (?)');
    stmt.run(code);
    const ticket = db.prepare('SELECT * FROM tickets WHERE code = ?').get(code);
    res.json(ticket);
})

app.post('/tickets/:code/use', (req, res) => {
  const { code } = req.params;
  const ticket = db.prepare('SELECT * FROM tickets WHERE code = ?').get(code);
  if (!ticket)
  {
      return res.status(404).json({ error: 'Ticket not found' });
  }
  if (ticket.used)
  {
      return res.status(409).json({ error: 'Ticket already used' });   
  }
  const stmt = db.prepare('UPDATE tickets SET used = 1 WHERE code = ?');
  stmt.run(code);
    const updatedTicket = db.prepare('SELECT * FROM tickets WHERE code = ?').get(code);
    res.json(updatedTicket);
})

app.delete('/tickets/:code', (req, res) => {
    const { code } = req.params;
    const ticket = db.prepare('SELECT * FROM tickets WHERE code = ?').get(code);
    if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
    }
    if (ticket.used) {
        return res.status(409).json({ error: 'Cannot delete a used ticket' });
    }
    
    const stmt = db.prepare('DELETE FROM tickets WHERE code = ?');
    stmt.run(code);
    res.json({ message: 'Ticket deleted successfully' });
})

app.listen(3001, () => {
   console.log('Server is running on port 3001');
});