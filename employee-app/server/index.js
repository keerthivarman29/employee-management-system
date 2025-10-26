const express = require('express');
const cors = require('cors');
const db = require('./db');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

app.get('/api/employees', (req, res) => {
  db.all('SELECT * FROM employees ORDER BY id DESC', [], (err, rows) => {
    if (err) res.status(500).json({error: err.message});
    else res.json(rows);
  });
});

app.post('/api/employees', (req, res) => {
  const { first_name, last_name, email, position, department, salary, joined_at } = req.body;
  if (!first_name || !last_name || !email) return res.status(400).json({error:'Missing fields'});
  const sql = 'INSERT INTO employees (first_name,last_name,email,position,department,salary,joined_at) VALUES (?,?,?,?,?,?,?)';
  db.run(sql,[first_name,last_name,email,position,department,salary,joined_at||new Date().toISOString().slice(0,10)],function(err){
    if (err) return res.status(500).json({error:err.message});
    db.get('SELECT * FROM employees WHERE id=?',[this.lastID],(e,row)=>{
      if(e) res.status(500).json({error:e.message}); else res.json(row);
    });
  });
});

app.put('/api/employees/:id', (req,res)=>{
  const { first_name,last_name,email,position,department,salary,joined_at } = req.body;
  db.run('UPDATE employees SET first_name=?,last_name=?,email=?,position=?,department=?,salary=?,joined_at=? WHERE id=?',
    [first_name,last_name,email,position,department,salary,joined_at,req.params.id],
    function(err){
      if(err) return res.status(500).json({error:err.message});
      db.get('SELECT * FROM employees WHERE id=?',[req.params.id],(e,row)=>{
        if(e) res.status(500).json({error:e.message}); else res.json(row);
      });
    });
});

app.delete('/api/employees/:id',(req,res)=>{
  db.run('DELETE FROM employees WHERE id=?',[req.params.id],function(err){
    if(err) res.status(500).json({error:err.message});
    else res.json({success:true});
  });
});

// serve frontend build
const staticPath = path.join(__dirname, '../client/dist');
app.use(express.static(staticPath));
app.get('*', (req,res)=>res.sendFile(path.join(staticPath,'index.html')));

app.listen(PORT, ()=>console.log('Server running at http://localhost:'+PORT));
