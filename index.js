const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { type } = require('express/lib/response');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));

const Schema = mongoose.Schema;

const Excercise = new Schema({
  username: {type: String},
  description: {type: String, required: true},
  duration: {type:Number, required: true},
  date: String,
  _id: String
});

const User = new Schema({
  username: {type: String, required: true},
  _id: {type: String, required: true}
});

const Log = new Schema({
  username: String,
  count: Number,
  _id: String,
  log: [{
    description: String,
    duration: Number,
    date: String,
  }]
});

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})



//Endpoints

app.post("/api/users", function(res, req){
  
  let user = new User({
    username: "fcc_test",
    _id: "5fb5853f734231456ccb3b05"
  });

  user.save(function(err, data){
    if(err) return done(err);
    done(null, data);
  });

  res.json({username: user.username, _id: user._id});
});
app.post("api/users", function(res, req){});
app.post("api/users", function(res, req){});