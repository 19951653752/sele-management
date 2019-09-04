/**
 * @login & register
 */
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const router = express.Router()
const keys = require('../../config/keys').secretOrKey
const passport = require('passport')

const User = require('../../models/Users')

/**
 * $route   GET api/profiles/test
 * @desc    测试
 * @access  public
 */
router.get('/test',(req,res) => {
  res.send('hello')
})

/**
 * $route   GET api/users/register
 * @desc    返回请求的json数据
 * @access  public
 */
router.post('/register',(req,res) => {
  // console.log(req.body)

  // 查询数据库中该邮箱是否存在
  User.findOne({email:req.body.email})
      .then(user => {
        if(user){ // 邮箱存在
          return res.status(400).json('邮箱已被注册')
        }else{ // 邮箱不存在，进行写库
          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            avatar:gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'}),
            password:req.body.password,
            identity:req.body.identity
          })

          // 加密
          bcrypt.genSalt(10,(err, salt) => {
            bcrypt.hash(newUser.password, salt,(err, hash) => {
                if(err) throw err
                // 如果加密成功，把把加密之后的密码给newUser.password
                newUser.password = hash

                newUser.save()
                    .then(user => res.json(user)) // 这个user和上面.then(user)不是一回事
                    .catch(err => console.log(err))
            });
        });
        }
      })
})

/**
 * $route   GET api/users/login
 * @desc    返回token jwt passport
 * @access  public
 */
router.post('/login', (req,res) => {
  const email = req.body.email
  const password = req.body.password
  // 查询数据库
  User.findOne({email})
      .then(user => {
        if(!user){
           return res.status(404).json('邮箱不存在')
        }

        // 密码匹配
        //    password => 用户输入的密码
        //    user.password => 用户输入的邮箱所对应在数据库中的密码
        //    用这两个密码进行比较
        bcrypt.compare(password, user.password)
            .then(isMatch => {
              if(isMatch){
                // jwt.sjgn('规则','加密名字','过期时间','箭头函数')
                const rule = {
                  id:user.id,
                  name:user.name,
                  avatar:user.avatar,
                  identity:user.identity
                }
                jwt.sign(rule,keys,{expiresIn:3600},(err,token) => {
                  if(err) throw err
                  res.json({
                    success:true,
                    token:'Bearer '+token
                  })
                })
                
              }else{
                return res.status(400).json('密码错误!')
              }
            })
      })
})

/**
 * $route   GET api/users/current
 * @desc    return current user
 * @access  private
 */
// router.get('/current',passport.authenticate('jwt',{session:false}),(req,res) => {
//   res.json({
//     id:req.user.id,
//     name:req.user.name,
//     email:req.user.email,
//     identity:req.user.identity
//   })
// })

module.exports = router