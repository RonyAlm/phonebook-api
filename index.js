require('dotenv').config();
require('./mongo.js');

const Person = require('./models/Person');

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


app.get('/api/persons', (req, res, next) => {
    Person.find({})
        .then(persons => {
            res.status(200).json(persons);
        }).catch(error => {
            next(error);
        });
});

app.get('/info', (req, res, next) => {
    const date = new Date();
    Person.find({})
        .then(persons => {
            res.status(200).send(`
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${date}</p>
        `);
        })
        .catch(error => {
            next(error);
        });
});

app.get('/api/persons/:id', (req, res, next) => {

    const { id } = req.params;

    Person.findById(id)
        .then(person => {
            if (person) {
                res.status(200).json(person);
            } else {
                res.status(404).json({ error: 'Person not found' });
            }
        })
        .catch(error => {
            next(error);
        });

});

app.delete('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;

    Person.findByIdAndDelete(id)
        .then(() => {
            res.status(204).end();
        })
        .catch(error => {
            next(error);
        });
});

app.post('/api/persons', (req, res, next) => {
    const person = req.body;
    if (!person.name || !person.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    const newPerson = new Person({
        name: person.name,
        number: person.number
    });

    newPerson.save()
        .then(savedPerson => {
            res.status(201).json(savedPerson);
        })
        .catch(error => {
            next(error);
        })

});

app.put('/api/persons/:id', (req, res, next) => {
    const { id } = req.params;
    const body = req.body;

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' });
    }

    const newPerson = {
        name: body.name,
        number: body.number
    };

    Person.findByIdAndUpdate(id, newPerson, { new: true }, { runValidators: true }, { context: 'query' })
        .then(updatedPerson => {
            if (!updatedPerson) {
                return res.status(404).json({ error: 'Person not found' });
            }
            res.status(200).json(updatedPerson);
        })
        .catch(error => {
            next(error);
        })

});

// Middleware
const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (error, req, res, next) => {
    console.error(error.message);
    if (error.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    } else {
        return res.status(500).json({ error: error.message });
    }
    next(error);
}

app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});