const express = require('express');
const router = express.Router();
const md5 = require('blueimp-md5')
const { UserModel, roleModel } = require('../db/react-admin')
const jwt = require('jsonwebtoken');
const filter = { password: 0, __v: 0 } // 过滤掉查询时不需要的属性数据


/**
 * 获取用户列表
 */
router.post('/list', function (req, res) {
  UserModel.find((error, userDoc) => {
    const users = [];
    userDoc.map((user) => {
			if(!(user.type==="maximum" && user.role_id === "0")) {
        users.push(user);
      }
		})
    if(userDoc) {
      roleModel.find((err,roleDoc) => {
        if(roleDoc) {
          // res.send({ code: 0, msg: '获取列表成功', users: userDoc, roles: roleDoc });
          res.send({ code: 0, msg: '获取列表成功', users, roles: roleDoc });
        } else {
          res.send({code: 1, msg: '获取列表失败',data:null});
        }
      })
    } else {
      res.send({code: 1, msg: '获取列表失败',data:null});
    }  
  })
})

/**
 * 删除用户
 */
router.post('/delece', function (req, res) {
  const { userId } = req.body;  
  UserModel.remove({ _id: userId  },(error) => {
    if(!error) { 
      res.send({code: 0, msg: "删除成功！"})
    } else {
      res.send({code: 1, msg: '删除失败！'})
    }
  })
})

/**
 * 添加用户
 */
router.post('/add', function (req, res) {
  const { username, password, phone, email, role_id, roleName } = req.body
  const create_time = new Date().getTime();
  const type = "minimum";
  UserModel.findOne({username}, (error, usersDoc) => {
    if(usersDoc) {
      res.send({code: 1, msg: '此用户已存在, 请重新注册'})
    } else {
      let content ={email}; 
      let secretOrPrivateKey=phone+password
      let token = jwt.sign(content, secretOrPrivateKey, { expiresIn: 60*60*1 });
      token = token.substring(token.length-30);
      new UserModel({username, password: md5(password), phone, email, token, type, role_id, create_time,roleName}).save((error, userDoc) => {
        res.json({ code: 0, msg: '注册成功', data: userDoc,userId: userDoc._id })
      })
    }
  })
})

/**
 * 更新用户
 */
router.post('/updata', function (req, res) {
  const { username, phone, email, role_id, roleName, _id } = req.body
  UserModel.findByIdAndUpdate({ _id }, { username, phone, email, role_id, roleName }, (error, usersDoc) => {
    if(usersDoc) {// 有数据
      res.send({code: 0, msg: "更新用户信息成功", data: usersDoc});
    } else {// 没有数据
      res.send({code: 1, msg: '更新用户信息失败'});
    }
  })
})

  
module.exports = router;
  
