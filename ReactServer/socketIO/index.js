/**
 *  socketio 通信 
 * */  
const express = require("express");
const router = express.Router();
const { UserModel, ChatModel } = require("../db/react-socketio");
const jwt = require("jsonwebtoken");

const filter = { password: 0, __v: 0 };


/**
 *  注册接口
 */
router.post("/register", (req, res) => {
  const { username, password, password2, type } = req.body;
  if(password != password2) {
    res.send({code: 3, msg: '密码和确认密码不一至', data: null})
    return;
  }
  UserModel.findOne({ username }, filter, (err, userDocs) => {
    if(userDocs) {
      res.send({code: 1, msg: '此用户已存在, 请重新注册', data: null})
    } else {
      let content = { username }; 
      let secretOrPrivateKey = type 
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60*60*1
      });
      token = token.substring(token.length-30);
      const create_time = +new Date() 
      new UserModel({username, password, token, type, create_time}).save((error, userDoc) => {
        if(error) {
          res.send({code: 2, msg: '用户注册失败!!!', data: null});
        } else {
          res.json({ code: 0, msg: '用户注册成功!!!', data: userDoc })
        }
      })
    }
  })
})


/**
 *  登录接口
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  UserModel.findOne({ username, password }, filter, (err, userDoc) => {
    if(userDoc) {
      res.send({ code: 0, msg: "登录成功", data: userDoc });
    } else {
      res.send({ code: 1, msg: '用户名或密码错误!', data: null })
    }    
  })
})


/**
 *  更新用户信息接口
 */
router.post('/update', function (req, res) {
  // 得到请求cookie的userid
  const _id = req.cookies.SOCKETIO_TOKEN
  if(!_id) {
    res.send({code: 404, data: null, msg: '请先登录'});
    return
  }
  // 更新数据库中对应的数据   UserModel.updateOne() 查找信息     UserModel.findByIdAndUpdate() 只能用 _id 来跟新数据
  UserModel.findByIdAndUpdate({ _id }, req.body, function (err, user) {// user是数据库中原来的数据
    // 合并用户信息
    if(!err) {
      const data = Object.assign(user, req.body);
      res.send({code: 0, data, msg: '您的信息保存成功!!!'});
    } else {
      res.send({code: 1, data:null, msg: '您的信息保存失败!!!'});
    }
  })
})


/**
 *  获取用户信息接口
 */
router.post('/userinfo', function (req, res) {
  // 得到请求cookie的userid
  const _id = req.cookies.SOCKETIO_TOKEN
  if(!_id) {
    res.send({code: 404,  msg: '请先登录!!!', data: null});
    return
  }
  UserModel.findOne({ _id }, filter, function (err, user) {
    if(!err) {
      res.send({code: 0, msg: '请求成功!!!', data: user  });
    } else {
      res.send({code: 1, msg: '接口报错!!!', data: null });
    }
  })
})


/**
 * 查看用户列表(指定类型的)
 */
router.get('/userlist',function(req, res){
    const { type } = req.query;
    UserModel.find({ type },filter, function(err,users){
      if(err) {
        res.send({code: 1, msg: '接口报错!!!', data: null });
      } else {
        res.json({ code:0, msg: '用户列表获取成功!!!', data: users })
      }
    })
})


/**
 *  获取当前用户所有相关聊天信息列表
 */
router.get('/msglist',function(req, res){
  const userId = req.cookies.SOCKETIO_TOKEN;
  UserModel.find(function(err,userDocs){
    // 用对象存储所有 user 信息： key 为 user 的 _id, value 为name和header组成的 users 对象
    if(err) {
      res.send({code: 1, msg: '接口报错!!!', data: null });
    } else {
      const users = userDocs.reduce((users, user) => {
        users[user._id] = { username: user.username, header: user.header };
        return users;
      }, {})
      ChatModel.find({ '$or': [{ from: userId }, { to: userId }]}, filter, function(error, chatMsgs) {
        if(error){
          res.send({code: 1, msg: '接口报错!!!', data: null });
        } else {
          res.send({code: 0, msg: '请求成功!!!', data: { users, chatMsgs } });
        }
      })
    }
  })
})


/**
 * 修改指定消息为已读
 */
router.post('/readmsg',function(req, res){
  const from = req.body.from;
  const to = req.cookies.SOCKETIO_TOKEN;
  ChatModel.update({ from, to ,read: false }, { read:true }, { multi: true }, function(err, doc) {
    if(err) {
      res.send({code: 1, msg: '接口报错!!!', data: null });
    } else {
      res.send({code: 0, msg: '请求成功!!!', data: doc.nModified });  // 跟新的数量
    }
  })
})



module.exports = router;





/*
提供一个用户注册的接口
  a)path为: /register
  b)请求方式为: POST
  c)接收username和password参数
  d)admin和xfzhang是已注册用户
  e)注册成功返回: {code: 0, data: {_id: 'abc', username: "xxx’, password:’123’}}
  f)注册失败返回: {code: 1, msg: '此用户已存在'}
 */
/*
后台路由回调的3步?
1. 获取请求参数数据
    GET:
      query参数: /register?username=xxx&password=yyy   req.query属性
      param参数: /register/:username  /register/xxx   req.params属性
    POST: req.body属性
2. 处理数据
    a. 会有一些逻辑计算
    b. 可能会操作数据库

3. 返回响应数据
 */  
  // router.post('/manage/user/add', function (req, res) {
  //   // 1. 获取请求参数
  //   const {username, password, phone, email} = req.body
  //   // 2. 处理: 根据username查询users集合, 如果没有, 直接返回了一个失败的提示数据, 如果有, 保存, 完成后返回一个成功的信息
  //   UserModel.findOne({username}, (error, userDoc) => {
  //     if(userDoc) {// 此用户已存在
  //       // 3. 返回响应(失败)
  //       res.send({code: 1, msg: '此用户已存在, 请重新注册'})
  //     } else {// 此用户不存在 , 可以注册
  //       let content ={username}; // 要生成token的主题信息
  //       let secretOrPrivateKey=email // 这是加密的key（密钥） 
  //       let token = jwt.sign(content, secretOrPrivateKey, {
  //           expiresIn: 60*60*1  // 1小时过期
  //       });
  //       token = token.substring(token.length-30);
  //       new UserModel({username, password: md5(password), phone, email,token}).save((error, userDoc) => {
  //         // 向浏览器返回一个cookie数据(实现注册成功后自动登陆了)
  //         // res.cookie('REACTTOKEN', token, {maxAge: 1000*60*60*24*7})
  //         // 3. 返回响应(成功)
  //         res.json({code: 0, msg: '注册成功', data: {token, username, phone, email,_id:userDoc._id}})
  //       })
  //     }
  //   })
  // })
  
  
  
  // // 2. 登陆的路由
  // router.post('/login', function (req, res) {
  //   const {username, password} = req.body
  //   // 根据username和password查询users集合, 如果有对应的user, 返回成功信息, 如果没有返回失败信息
  //   UserModel.findOne({username, password: md5(password)}, filter, (error, userDoc) => {
  //     if(userDoc) { // 成功
  //       // 向浏览器返回一个cookie数据(实现7天免登陆)
  //       res.cookie('REACTTOKEN', userDoc.token, {maxAge: 1000*60*60*24*7})
  //       res.send({code: 0, msg: "登录成功", data: userDoc})
  //     } else { // 失败
  //       res.send({code: 1, msg: '用户名或密码错误!'})
  //     }
  //   })
  // })
  
  // // 3. 更新用户路由
  // router.post('/update', function (req, res) {
  //   // 得到请求cookie的userid
  //   const userid = req.cookies.userid
  //   if(!userid) {// 如果没有, 说明没有登陆, 直接返回提示
  //       return res.send({code: 1, msg: '请先登陆'});
  //   }
  
  //   //更新数据库中对应的数据
  //   UserModel.findByIdAndUpdate({_id: userid}, req.body, function (err, user) {// user是数据库中原来的数据
  //     const {_id, username, type} = user
  //     // node端 ...不可用
  //     // const data = {...req.body, _id, username, type}
  //     // 合并用户信息
  //     const data = Object.assign(req.body, {_id, username, type})
  //     // assign(obj1, obj2, obj3,...) // 将多个指定的对象进行合并, 返回一个合并后的对象
  //     res.send({code: 0, data})
  //   })
  // })
  
  
  // // 根据cookie获取对应的user
  // router.get('/user', function (req, res) {
  //   // 取出cookie中的userid
  //   const userid = req.cookies.userid
  //   if(!userid) {
  //     return res.send({code: 1, msg: '请先登陆'})
  //   }
  
  //   // 查询对应的user
  //   UserModel.findOne({_id: userid}, filter, function (err, user) {
  //     if(user) {
  //       return res.send({code: 0, data: user})
  //     } else {// cookie中的userid不正确
  //       res.clearCookie('userid')  // 删除不正确cookie数据
  //       return res.send({code: 1, msg: '请先登陆'})
  //     }
  //   })
  // })
  
  
  