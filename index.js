const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('dist'));

morgan.token('body', (req, res) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : '';
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res) => {
    res.status(200).json(persons);
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.status(200).send(`
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${date}</p>
    `);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    if (person) {
        res.status(200).json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }
    if (persons.find(p => p.name === person.name)) {
        return res.status(400).json({ error: 'name must be unique' });
    }
    const id = Math.floor(Math.random() * 1000000);
    person.id = id;
    persons = persons.concat(person);
    res.status(201).json(person);
});

app.path('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);
    console.log(person);
    if (person) {
        person.number = req.body.number;
        res.status(200).json(person);
    } else {
        res.status(404).json({ error: 'person not found' });
    }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});