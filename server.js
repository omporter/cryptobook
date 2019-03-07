// node imports
const path  = require('path');

// third party imports
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const passport = require('passport');

// local imports
const userNew = require('./routes/api/userNew');
const user = require("./routes/api/user");
const content = require("./routes/api/content");
const portfolioSheet = require("./routes/api/portfolioSheet");
const completedTradesSheet = require("./routes/api/completedTradesSheet");
const liveTradesSheet = require("./routes/api/liveTradesSheet");
const tickersSheet = require("./routes/api/tickersSheet");
const wrapper = require("./routes/api/wrapper");

// config
const app = express(); // express config
app.use(morgan("short")); // sends http status in terminal
const db = require("./config/keys").mongoURI; // DB Config

// connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  ) // this second argument just removes an error from node. Can remove no problem.
  .then(() => {
    console.log("MongoDB Connected\n");
  })
  .catch(err => {
    console.log("DB connection failed\n", err);
  });


app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, PATCH");
    return next();
  });  

// middleware
app.use(bodyParser.json()); // application/json
app.use(passport.initialize());
require('./config/passport')(passport); // passport config 

// app.use(bodyParser.urlencoded({extended: true})); // x-www-form-urlencoded <form>
app.use("/api/userNew", userNew);
app.use("/api/users", user);
app.use("/api/content", content);
app.use("/api/portfolioSheet", portfolioSheet);
app.use("/api/liveTradesSheet", liveTradesSheet);
app.use("/api/completedTradesSheet", completedTradesSheet);
app.use("/api/tickersSheet", tickersSheet);
app.use("/api/wrapper", wrapper);

// server static assets if in production
if(process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  // for any route that gets hit, we load the index.html build file 
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  });

}

// server Config
const port = 4000;
app.listen(process.env.PORT || port, () => {
  console.log(`Server Running on Port ${port}`);
});
