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

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


app.post("/api/users", async (req, res) => {
  
  const createUser = async (done) => {
    try{
      let user = new User({ username: req.body.username });
      let savedUser = await user.save();

      res.json({ username: savedUser.username, _id: savedUser._id });
    } 
    catch(err){ res.status(500).json({error: 'Failed to create user'}); }
  }
  
});


exports.UserModel = User;