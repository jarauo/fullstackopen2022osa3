require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose');
const Person = require('./models/person')
const { response } = require('express')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('reqContent', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqContent'))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "39-23-6423122"
    }
  ]

app.get('/info', (req, res) => {
    let currentTime = new Date()
    res.send(`<div>Phonebook has info for ${persons.length} people</div>
            <div>${currentTime}</div>`)
})

app.get('/api/persons', (req,res) => {
    //res.json(persons)
    Person.find({}).then(people => {
        res.json(people)
        //mongoose.connection.close()
    })
        
})

app.get('/api/persons/:id', (req,res) => {
    //const id = Number(req.params.id)
   //const person = persons.find(person => person.id === id)
    
    //if (person) {
    //    res.json(person)
   // } else {
    //    res.status(204).end()
    //}
    Person.findById(req.params.id).then(person => {
        res.json(person)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const generateId = () => {
    let Id = Math.floor(Math.random()*10000000000)

    while(persons.filter(person => person.id === Id).length > 0) {
        Id = Math.floor(Math.random()*10000000000)
        console.log("Inside loop", Id)
    }
    console.log("Outside loop", Id)

    return Id
}

//const checkIfUniqueName = (name) => {
//    let nameFound = persons.filter(person => person.name === name).length > 0
//    return nameFound
//}


app.post('/api/persons', (req, res) => {
    const body = req.body

    if (body.name === undefined) {
        return res.status(400).json({
            error: 'name missing'
        })
    }

    //if (checkIfUniqueName(body.name)) {
    //    return res.status(400).json({
    //        error: 'name must be unique'
    //    })
    //}

    if (body.number === undefined) {
        return res.status(400).json({
            error: 'number missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})