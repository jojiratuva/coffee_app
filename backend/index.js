// setting up our dependencies
const express = require('express');
const app = express();
const port = 3100;
const cors = require('cors');

// body-parser passes information from front-end to back-end 
const bodyParser = require('body-parser');
// this is our middleware for talking to mongodb 
const mongoose = require('mongoose');
const config = require('./config.json');
console.log(config.user);
// schemas 
// every schema needs to start with a capital 

const { schema } = require('./models/coffee');
const Coffee = require('./models/coffee')

// Start our dependencies
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// start our server 
app.listen(port, () => {
    console.log(Coffee);
    console.log(`server running ${port}`)
})

// let's connect to mongoDB cloud
// Cluster name: mycluster
// Username: tim
// Password: 123
mongoose.connect(
    `mongodb+srv://${config.userName}:${config.passWord}@clusternew.jikrz77.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
    // .then is a chaining method used with promises
    // in simple terms, it will run something after the function before it 
).then(() => {
    console.log(`You've connected to MongoDB!`)
    // .catch is a method to "catch" any errors which might happen in a promise
}).catch((err) => {
    console.log(`DB connection error ${err.message}`)
})

// Set up a route/endpoint which the frontend will access
// app.post will send data to the database

app.post('/addCoffee', (req, res) => {
    // create a new instance of the coffee schema
    const newCoffee = new Coffee({
        // give our new coffee the details we sent from the frontend
        _id: new mongoose.Types.ObjectId,
        name: req.body.name,
        price: req.body.price,
        image_url: req.body.image_url
    });
    // to save the newcoffee to the database
    // use the variable declared above
    newCoffee.save()
        .then((result) => {
            console.log(`Added a new coffee successfully!`)
            // return back to the frontend what just happened
            res.send(result)
        })
        // catch any errors
        .catch((err) => {
            console.log(`Error: ${err.message}`)
        })
});

//here we are setting up a new route

app.get('/allCoffee', (req, res) => {
    // .find will search for all the coffees
    Coffee.find()
        // .then is method in which we can chain functions on
        // chaining means that once something has run, then we can
        // run another thing
        // the result variable is being returned by the .find() then we ran earlier
        .then(result => {
            // send back the result of the search to whoever asked for it
            // in other words, send back the result to the frontend
            res.send(result)
        })
})