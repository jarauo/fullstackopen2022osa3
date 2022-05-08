const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 3) {
  console.log('give username and password as arguments')
  process.exit(1)
}

const user = process.argv[2]
const password = process.argv[3]
const url = `mongodb+srv://${user}:${password}@cluster0.jmqoj.mongodb.net/phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}

if (process.argv.length > 3) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })

  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}















