const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5')
const { UserModel, roleModel } = require('../db/react-admin')
const jwt = require('jsonwebtoken');
const upload = require('../utils/muterUtils');
const BASE_URL = "http://localhost:4000";
const filter = {password: 0, __v: 0} // 过滤掉查询时不需要的属性数据

// 注册的路由
router.post('/register', function (req, res) {
  // 1. 获取请求参数
  const { username, password, phone, email, role_id, roleName } = req.body;
  const type = "maximum";
  const create_time = +new Date();
  // 2. 处理: 根据username查询users集合, 如果没有, 直接返回了一个失败的提示数据, 如果有, 保存, 完成后返回一个成功的信息
  UserModel.findOne({username}, (error, usersDoc) => {
    if(usersDoc) {// 此用户已存在
      // 3. 返回响应(失败)
      res.send({code: 1, msg: '此用户已存在, 请重新注册'})
    } else {// 此用户不存在 , 可以注册
      let content = { email }; // 要生成token的主题信息
      let secretOrPrivateKey = phone // 这是加密的key（密钥） 
      let token = jwt.sign(content, secretOrPrivateKey, {
          expiresIn: 60*60*1  // 1小时过期
      });
      token = token.substring(token.length-30);
      new UserModel({username, password: md5(password), phone, email, token, type, role_id, create_time,roleName}).save((error, userDoc) => {
        res.json({ code: 0, msg: '注册成功', data: userDoc,userId: userDoc._id })
      })
    }
  })
})


/**
 * 登录路由
 */
router.post('/login', function (req, res) {
  const {username, password} = req.body
  // 根据username和password查询users集合, 如果有对应的user, 返回成功信息, 如果没有返回失败信息
  UserModel.findOne({username, password: md5(password)}, filter, (error, userDoc) => {
    if(userDoc) { 
      // 向浏览器返回一个cookie数据(实现7天免登陆)
      res.cookie('REACTTOKEN', userDoc.token, {maxAge: 1000*60*60*24*7})
      if(userDoc.role_id !== "0") {
        roleModel.findOne({ _id: userDoc.role_id }, (err, roleDoc) => {
          if(roleDoc) {
            res.json({code: 0, msg: "登录成功", data:{ user: userDoc, role: roleDoc } });
          }
        })
      } else {
        res.send({code: 0, msg: "登录成功", data: userDoc});
      }
    } else { // 失败
      res.send({code: 1, msg: '用户名或密码错误!'})
    }
  })
})



/**
 * 获取用户列表
 */



/**
 * 上传图片
 */
router.post('/manage/img/upload', upload.single('files'), function (req, res) {
  if(req.file) {
    const name = req.file.filename;
    const imgUrl = BASE_URL + '/upload/' + req.file.filename;
    res.send({code: 0, msg: '上传图片成功', data: { imgUrl, name }});
  } else {
    res.send({code: 1, msg: '上传图片失败'});
  }
})


module.exports = router;



