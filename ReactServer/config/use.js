
/**
 * mongodb_ 的使用方式 
 */

const { DB_ , connet_db } = require('./mongodb_');
DB_.filenameJson("/config/dcm.json") //加载数据库表json配置
connet_db({
  db_user: "dcm",//用户名
  db_pwd: "123456",//密码
  db_host: "0.0.0.0",//ip
  db_port: 27017, //端口
  db_name: "dcm" // 数据库名
})
DB_.find('user', {Username: "editor"}, function (err, res) {
  console.log(res);
});
 
// 数据库表配置如下:json
var user =  {
    "user": {
            "Username": "String",
            "Password": "String",
            "Password": "String"
        }
}

