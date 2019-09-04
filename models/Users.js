const mongoose = require('mongoose')

const User = mongoose.model('users', {
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  avatar:{
    type:String
  },
  identity:{
    type:String,
    required:true
  },
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports = User