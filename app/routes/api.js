var User        = require('../models/user');
var config      = require('../../config');
var secretKey   = config.secretKey;
var jwt         = require('jsonwebtoken');

function createToken(user) {
  var token = jwt.sign({
    _id: user.id,
    name: user.name,
    username: user.username
  }, secretKey, {
    expiresInMinute: 1440
  });

  return token;
}

module.exports = function(app, express) {
  var api = express.Router();

  api.post('/signup', function(req, res) {
    var user = new User({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });

    user.save(function(err) {
      if (err) {
        res.send(err);
        return;
      }

      res.json({ message: "User has been created!" });
    });
  });

  api.get('/users', function(req, res) {
    User.find({}, function(err, users) {
      if (err) {
        res.send(err);
        return;
      }

      res.json(users);
    });
  });

  api.post('/login', function(req, res) {
    User.findOne({
      username: req.body.username
    }).select('password').exec(function(err, user) {
      if(err) throw err;
      if (!user) {
        res.send({ message: "User doesn't exist" });
      } else if (user) {
        var validPassword = user.checkPassword(req.body.password);

        if (!validPassword) {
          res.send({ message: "Invalid password" })
        } else {
          // token
          var token = createToken(user);
          res.json({
            success: true,
            message: "Successfully logged in!",
            token: token
          });
        }
      }
    });
  });

  return api;

}
