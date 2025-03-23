const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);

// Conexion a mongoDB
mongoose.connect(connectionString)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });




// const person = new Person({
//     name: 'Arto Hellas',
//     number: '040-123456'
// });

// person.save()
//     .then((result) => {
//         console.log('Person saved successfully', result);
//         mongoose.connection.close();
//     })
//     .catch((error) => {
//         console.error('Error saving Person:', error.message);
//         mongoose.connection.close();
//     });

