var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var Schema = mongoose.Schema;

var UserShema = new Schema({
  name: String,
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true, select: false }
});

UserShema.pre('save', function(next) {
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.hash(user.password, null, null, function(err, hash) {
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

module.exports = mongoose.model("User", UserShema);
