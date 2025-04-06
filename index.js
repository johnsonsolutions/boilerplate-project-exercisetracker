const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

const Schema = mongoose.Schema;

// Updated Exercise schema with userId instead of _id
const ExerciseSchema = new Schema({
  userId: { type: String, required: true },
  username: { type: String },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: String
});
const Exercise = mongoose.model("Exercise", ExerciseSchema);

const UserSchema = new Schema({
  username: { type: String, required: true }
});
const User = mongoose.model("User", UserSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.post("/api/users", async (req, res) => {
  try {
    let user = new User({ username: req.body.username });
    let savedUser = await user.save();
    res.json({ username: savedUser.username, _id: savedUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/users/:_id/exercises", async (req, res) => {
  try {
    let user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    let checkDate = req.body.date === "" || !req.body.date ? new Date() : new Date(req.body.date);

    let exercise = new Exercise({
      userId: user._id,
      username: user.username,
      description: req.body.description,
      duration: Number(req.body.duration),
      date: checkDate.toISOString()
    });

    let savedExercise = await exercise.save();

    res.json({
      _id: user._id,
      username: user.username,
      date: new Date(savedExercise.date).toDateString(),
      duration: savedExercise.duration,
      description: savedExercise.description
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users", async (req, res) => {
  let users = await User.find();
  res.json(users);
});

app.get("/api/users/:_id/logs", async (req, res) => {
  try {
    let user = await User.findById(req.params._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const { from, to, limit } = req.query;

    let findQuery = { userId: req.params._id };

    if (from || to) {
      findQuery.date = {};
      if (from) findQuery.date.$gte = new Date(from).toISOString();
      if (to) findQuery.date.$lte = new Date(to).toISOString();
    }

    let query = Exercise.find(findQuery);
    if (limit) query = query.limit(parseInt(limit));

    let exercises = await query.exec();

    let logs = exercises.map(d => ({
      description: d.description,
      duration: d.duration,
      date: new Date(d.date).toDateString()
    }));

    res.json({
      username: user.username,
      count: logs.length,
      _id: user._id,
      log: logs
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

exports.UserModel = User;
exports.ExerciseModel = Exercise;
