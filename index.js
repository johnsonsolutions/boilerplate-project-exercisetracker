const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(bodyParser.urlencoded({ extended: false }));

const Schema = mongoose.Schema;

const Excercise = new Schema({
  username: "fcc_test",
  description: "test",
  duration: 60,
  date: "Mon Jan 01 1990",
  _id: "5fb5853f734231456ccb3b05"
});

const User = new Schema({
  username: "fcc_test",
  _id: "5fb5853f734231456ccb3b05"
});

const Log = new Schema({
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
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

app.post("api/users", function(res, req){
  
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