const express = require('express');
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://pattamu:iKHwECgQCaYNVpge@sandeepcluster.9rzkh.mongodb.net/group35_Project3Database?retryWrites=true&w=majority", {

    useNewUrlParser: true
    
})

.then( () => console.log("MongoDb is connected"))

.catch ( err => console.log(err) )

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});