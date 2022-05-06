const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        required: true
    },
    number: {
        type: String,
        minlength: [8,'phonenumber is shorter than the minimum allowed length (3)'],
        required: true,
        //match: /(\d{3}-\d{8})|(\d{2}-\d{7})/
        validate: {
            validator: function(v) {
                let parts = v.split("-")
                if (parts[0].length === 2 && parts[1].length === 7) {
                    return true
                } else if (parts[0].length === 3 && parts[1].length === 8) {
                    return true
                } else {
                    return false
                }
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
    
module.exports = mongoose.model('Person', personSchema)