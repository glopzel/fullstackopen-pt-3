const express = require('express');
const req = require('express/lib/request');
const app = express();
const PORT = 3000;
const morgan = require('morgan');

let data = [
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

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

// middleware power 
app.use(express.json())
app.use(requestLogger)
app.use(morgan('tiny'))

// return the stringified version of the content's body
morgan.token('body', (request, response) => JSON.stringify(request.body))
// :method :url :status :res[content-length] - :response-time ms
// POST /url/url 200 61 - X ms {key: value}
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
    response.send('<h1>phonebook</h1>')
});

app.get('/api/persons', (request, response) => {
    // sends all
    response.json(data);
});

app.get('/api/persons/:id', (request, response) => {
    const person = Number(request.params.id);
    // if there is a person with that index number
    if (data[person]) {
        response.json(data[person]);
    } else {
        // if there is not a person with that id
        response.status(404).end()
    }
})

app.get('/info', (request, response) => {
    // get date
    const date = new Date();
    // number of numbers
    const numberOfEntries = data.length - 1;
    response.send(`<h1>Phonebook as info for ${numberOfEntries} people <br> ${date}</h1>`)
});

app.delete('/api/persons/:id', (request, response) => {
    // get the id number that is requested
    const id = request.params.id;
    // filter out those that are not going to be deleted
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
});

const generateId = () => {
    // find the biggest id and add 1 to get the id of the new item
    const bigNum = Math.max(...data.map(item => item.id));
    return bigNum + 1;
}

app.post('/api/notes', (request, response) => {
    const body = request.body
    
    // check if the info is full
    if (!body.name || !body.number) {
        return response.status(400).json({ 
            error: 'info missing' 
        })
    } else if (data.indexOf(body.name) !== -1) {
        // if the name is already taken
        return response.status(400).json({ 
            error: 'the name already exists in the phonebook' 
        })
    }
    
    // make the new entry
    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    // add new person to the OG data
    data = data.concat(newPerson);
    // send the new person
    response.json(newPerson)
})

// handles incorrect requests
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint);

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})