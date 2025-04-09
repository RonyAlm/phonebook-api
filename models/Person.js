const { Schema, model } = require('mongoose');

const personSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        unique: true,
        minlength: 8,
        validate: {
            // Regular expression to validate phone number format (e.g., 123-456743434, 12-43434344)
            validator: function (v) {
                return /\d{2,3}-\d{5,}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
});

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});


const Person = model('Person', personSchema);

module.exports = Person;