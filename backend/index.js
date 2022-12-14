// setting up our dependencies
// -----------------------------------------------------
//                              DEPENDENCIES 
// ----------------------------------------------------

const express = require('express');
const app = express();
const port = 3100;
const cors = require('cors');

// body-parser passes information from front-end to back-end 
const bodyParser = require('body-parser');
// this is our middleware for talking to mongodb 
const mongoose = require('mongoose');

// bcrypt for encrypting data (passwrords)
const bcrypt = require('bcryptjs');
// grab our config 
const config = require('./config.json');
// console.log(config.user);


// ----------------------------------------------------
//                              SCHEMAS 
// ----------------------------------------------------

// every schema needs to start with a capital 

const { schema, findById } = require('./models/coffee');
const Coffee = require('./models/coffee');
const User = require("./models/user");

// ------------------------------------------------ 
//                              START DEPENDENCIES
// ------------------------------------------------ 

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());

// -------------------------------------------------- 
//                                 STRART SERVER
// -------------------------------------------------- 

// start our server
app.listen(port, () => {
    console.log(Coffee);
    console.log(`server running ${port}`)
})

// ---------------------------------------
//                 AUTHENTICATE MONGODB
// ---------------------------------------

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

// ----------------------------------------
//                      ADD METHOD
// ----------------------------------------

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

// ----------------------------------------
//                      ADD GET 
// ----------------------------------------
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

// set up delete route 
// this route will only be activated when user clicks on it in the browser

// ----------------------------------------------
//                        ADD DELETE 
//-----------------------------------------------


app.delete('/deleteCoffee/:id', (req, res) => {

    const coffeeId = req.params.id;
    console.log(`this id has been deleted`);
    console.log(coffeeId);
    // findById() looks up a piece of dara based on the id arhument which we give to it first
    // we're giving it the offeeOd variable 
    // then function will provide is the details on that coffee or an error if it doesnt work
    Coffee.findById(coffeeId, (err, coffee) => {
        if (err) {
            console.log(err);
        } else {
            // console.log(coffee);
            Coffee.deleteOne({ _id: coffeeId })
                .then(() => {
                    console.log(`actually delete from MongoDB`);
                    res.send(coffee)

                })
                .catch((err) => {
                    console.log(err);
                })
        }
    })
})

//---------------------------
// ADD PATCH 
//---------------------------

app.patch('/updateProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Coffee.findById(idParam, (err, coffee) => {
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            image_url: req.body.image_url
        }
        Coffee.updateOne({
            _id: idParam
        }, updatedProduct).
            then(result => {
                res.send(result);
            })
            .catch(err => res.send(err))
    })
})
// =======================
//      Registering users
// =======================
app.post('/registerUser', (req, res) => { // Checking if user is in the DB already

    User.findOne({ username: req.body.username }, (err, userResult) => {

        if (userResult) {
            // send back a string so we can validate the user
            res.send('username exists');
        } else {
            const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                password: hash,
                profile_img_url: req.body.profile_img_url
            });

            user.save().then(result => { // Save to database and notify userResult
                res.send(result);
            }).catch(err => res.send(err));
        } // Else
    })
}) // End of Create Account

// Logging in

// ============
//     Log In
// =============
app.post('/loginUser', (req, res) => {
    // firstly look for a user with that username
    User.findOne({ username: req.body.username }, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('not authorised');
            } // inner if
        } else {
            res.send('user not found');
        } // outer if
    }) // Find one ends
}); // end of post login