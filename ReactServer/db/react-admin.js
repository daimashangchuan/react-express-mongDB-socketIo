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
mongoose.connect('mongodb://localhost:27017/react-admin')
// 1.3. 获取连接对象
const conn = mongoose.connection
// 1.4. 绑定连接完成的监听(用来提示连接成功)
conn.on('connected', function () {
  console.log('数据库 react-admin 连接完成!!!')
})


//   用户注册模板
const userSchema = mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  phone: {type: String, required: true}, // 电话
  email: {type: String, required: true}, // 邮箱
  token: {type: String, required: true}, // token信息
  role_id: {type: String, required: true}, // 所属角色 id
  roleName: {type: String, required: true}, // 所属角色名称
  type: {type: String, required: true}, //  设置的权限
  create_time:{type:Number, required: true}  // 注册时间
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('ReactUsers', userSchema);
// 2.3. 向外暴露Model
exports.UserModel = UserModel;


//  分类列表模板
const categorySchema = mongoose.Schema({
  parentId: {type: String, required: true}, // 一级分类 id
  name: {type: String, required: true}, // 一级分类名称
  created_time:{type:String, default:new Date().getTime()}
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const CategoryModel = mongoose.model('ReactCates', categorySchema)
// 2.3. 向外暴露Model
exports.CategoryModel = CategoryModel;



//   商品管理模板
const productSchema = mongoose.Schema({
  status: { type: Number, required: true },       //  上架/下架的状态   1/上     2/下
  name: { type: String, required: true },         //  商品名称  
  price: { type: Number, required: true },        //  商品价格
  desc: { type: String, required: true },         //  商品说明
  categoryId: { type: String, required: true },   //  商品分类一级 _id
  pCategoryId: { type: String, required: true },  //  商品分类二级 _id  
  imgs: { type: Array },                          //  商品的图片
  detail: { type: String },                       //  商品的详情              
  created_time:{ type:String, default:new Date().getTime() }
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const ProductModel = mongoose.model('ReactProds', productSchema);
// 2.3. 向外暴露Model
exports.ProductModel = ProductModel;


//   角色管理模板
const roleSchema = mongoose.Schema({
  menus: { type: Array, default:[] },            //  访问的权限路劲
  name: { type: String, required: true },        //  商品名称  
  create_time:{ type: Number, required: true },  //  创建的时间
  auth_name: { type: String, default: '' },      //  开放的名称
  auth_id: { type: String, default: '' },        //  开放的ID
  auth_time: { type: Number, default: null },    //  开放的时间
})
// 2.2. 定义Model(与集合对应, 可以操作集合)
const roleModel = mongoose.model('ReactRoles', roleSchema);
// 2.3. 向外暴露Model
exports.roleModel = roleModel;

/*
一级分类

{
    name: "电器"
    parentId: "0"
    __v: 0
    _id: "5dc10c49091e313d68cfe117"
}

*/


/*
二级分类

{
    name: "电器"
    parentId: "5dc10c49091e313d68cfe117"    //   一级的 _id
    __v: 0
    _id: "5dc10c49091e313d68cfe117"
}

*/



/*

{
        "imgs" : [
            "1574929013338.png"
        ],
        "name" : "联想ThinkPad 翼七",
        "status" : 1,
        "desc" : "年度重量级新品，X300丶T4500全新登场 更加轻薄机身设计",
        "price" : 66000,
        "pCategoryId" : "5dc10cde091e313d68cfe120",
        "categoryId" : "5dc10c49091e313d68cfe117",
        "detail" : "<ul>\n<li><span style=\"color: rgb(226,80,65);\">想你所需，紧致外观。</span>&nbsp;</li>\n</ul>\n<p> 联想私人定制，超乎你的想象！😀</p>\n",
}

*/


/*

{
    menus: [
      "/home",
      "/role",
      "/products"
    ],
    name: '测试',
    create_time: 1574928235833,
    auth_time: 1574928235833,
    auth_name: admin
    _id:"asda321sd3a165f4sdafa13",
    _v: 0,
}

*/

