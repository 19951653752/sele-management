const mongoose = require('mongoose')

const Profile = mongoose.model('profile', {
  type:{ // 类型
    type:String
  },
  describe:{ // 描述
    type:String
  },
  income:{ // 收入
    type:String,
    required:true
  },
  expend:{ // 支出
    type:String,
    required:true
  },
  cash:{ // 现金
    type:String,
    required:true
  },
  remark:{
    type:String
  },
  date:{
    type:Date,
    default:Date.now
  }
});

module.exports = Profile