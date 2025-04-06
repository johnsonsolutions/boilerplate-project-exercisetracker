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

const ExcerciseSchema = new Schema({
  username: {type: String},
  description: {type: String, required: true},
  duration: {type:Number, required: true},
  date: String,
  _id: String
});
const Excercise = mongoose.model("Excercise", ExcerciseSchema);

const UserSchema = new Schema({
  username: {type: String, required: true}
});
const User = mongoose.model("User", UserSchema);

const LogSchema = new Schema({
  username: String,
  count: Number,
  _id: String,
  log: [{
    description: String,
    duration: Number,
    date: String,
  }]
});
const Log = mongoose.model("Log", LogSchema);

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


app.post("/api/users", async (req, res) => {
  
  try{
    let user = new User({ username: req.body.username });
    let savedUser = await user.save();

    res.json({ username: savedUser.username, _id: savedUser._id });
  } 
  catch(err){ res.status(500).json({error: err.message }); }
  
});

app.post("/api/users/:_id/exercises", async (req, res) => {

  let user = await User.findById(req.params._id);


  let checkdate = req.body.date == "" ? new Date(Date.now()).toISOString() : req.body.date;

  try{
    let excercise = new Excercise({
      username: user.username,
      description: req.body.description,
      duration: req.body.duration,
      date: checkdate,
      _id: req.params._id
    });

    let savedExcercise = await excercise.save();


    let op = {
      _id: user._id,
      username: user.username,
      date: savedExcercise.date,
      duration: savedExcercise.duration,
      description: savedExcercise.description      
    };
    res.json(op);

  }
  catch(err){ res.status(500).json({ error: err.message }); }
});

app.get("/api/users", async (req, res)=>{
  let users = await User.find();
  res.json(users);
});

app.get("/api/users/:_id/logs", async (req, res)=>{
try{
  let exercises = await Excercise.find({_id: req.params._id});
  let log = await Log.findById(req.params._id);

  let count = await Excercise.count();
  console.log(count);


  let op = {
    _id: log._id,
    username: log.username,
    count: count,
    log: exercises
  };

  res.json(logs);
}
catch(err){ res.status(500).json({ error: err.message }); }

});


exports.UserModel = User;
exports.ExcerciseModel = Excercise;