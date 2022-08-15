// Here is our first schema
// Every schema needs the mongoose dependancy
const mongoose = require('mongoose');

// set up the properties of our Schema
// "new" sets up a piece of complicated Data. 
// schema can hold data and share it with mongodb 
const coffeeSchema = new mongoose.Schema(
    {
        // every schema requires a id. 
        _id : mongoose.Schema.Types.ObjectId,
        name: String,
        price: Number,
        image_url: String
        // this dataset will be exported to monogDB
    },
    {
        // version keys can help is with updated schemas for larger projects
        versionKey: false

    }
)

// set up an export telling this .js file to be sent to our main index.js
module.exports = mongoose.model('Coffee', coffeeSchema);
// first argument is the name of the schema 
// model('word') word can be anything
// second argument is the schema variable we declare above i.e coffeeSchema