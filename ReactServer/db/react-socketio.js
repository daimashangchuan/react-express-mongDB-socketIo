/*
包含n个能操作mongodb数据库集合的model的模块
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 定义出对应特定集合的Model并向外暴露
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
  2.3. 向外暴露Model
 */
/*1. 连接数据库*/
// 1.1. 引入mongoose
const mongoose = require('mongoose')
// 1.2. 连接指定数据库(URL只有数据库是变化的)
mongoose.connect('mongodb://localhost:27017/react-socketio')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () {
  console.log('数据库 server-socketio 连接完成!!!')
})

/*2. 定义出对应特定集合的Model并向外暴露*/
// 2.1. 字义Schema(描述文档结构)
const userSchema = mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  type: {type: String, required: true}, // 用户类型: dashen/laoban
  token: {type: String, required: true}, // 用户的 token
  header: {type: String}, // 头像名称
  post: {type: String}, // 职位
  info: {type: String}, // 个人或职位简介
  company: {type: String}, // 公司名称
  salary: {type: String}, // 工资 月薪
  create_time: {type: Number}// 创建时间
})

// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('socketusers', userSchema)
// 2.3. 向外暴露Model
exports.UserModel = UserModel

// 定义chats集合的文档结构
const chatSchema = mongoose.Schema({
  from: {type: String, required: true}, // 发送用户的id
  to: {type: String, required: true}, // 接收用户的id
  chat_id: {type: String, required: true}, // from和to组成的字符串
  content: {type: String, required: true}, // 内容
  read: {type:Boolean, default: false}, // 标识是否已读
  create_time: {type: Number} // 创建时间
})
// 定义能操作chats集合数据的Model
const ChatModel = mongoose.model('socketiochat', chatSchema)
// 向外暴露Model
exports.ChatModel = ChatModel



/*
1. 一次性暴露: module.exports = value
2. 分多次暴露: exports.xxx = value1  exports.yyy = value2
3. commonjs向外暴露暴露永远是exports
4. exports的默认值是一个{}

exports.xxx = function (){}   // 向外暴露一个对象, 对象中包含xxx方法
const xxx = require('xxx')
xxx.xxx()

module.exports = function (){}  // 向外暴露一个函数

如何选择暴露对象, 还是暴露一个函数?
    模块包含一个功能(函数)还是多个功能(对象)
 */