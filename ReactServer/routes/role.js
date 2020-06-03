const express = require('express');
const router = express.Router();
const { roleModel } = require('../db/react-admin')

//  角色管理  ==>

/**
 * 获取角色列表
 */
router.post('/list', function (req, res) {
  roleModel.find((error, roleDoc) => {
    if(roleDoc) {
        res.send({code: 0, msg: '角色列表获取成功',data:roleDoc});
    } else if(error){
        res.send({code: 2, msg: '暂无角色列表',data:[]});
    } else {
        res.send({code: 1, msg: '角色列表获取失败',data:null});
    }
  })
})

/**
 * 添加角色名称
 */
router.post('/add', function (req, res) {
    const { name } = req.body;
    const create_time = new Date().getTime();
    roleModel.findOne({ name }, (error, roleDoc) => {
      if(error) {
        res.send({code: 2, msg: '请求失败'});
        return;
      }else if(roleDoc) {
        res.send({code: 1, msg: '存在此角色，请重新输入'})
      } else {
        new roleModel({ name, create_time }).save((error, roleDocItem) => {
          res.json({code: 0, msg:"添加角色成功",  data: roleDocItem})
        })
      }
    })
})

/**
 * 更新角色权限
 */
router.post('/updata', function (req, res) {
  const { role } = req.body;
  const { _id, menus, auth_time, auth_name, auth_id } = role
  roleModel.findByIdAndUpdate({ _id }, {  menus, auth_time, auth_name, auth_id }, function (err, roleDoc) {// user是数据库中原来的数据
    if(!err) {
      res.send({code: 0, msg:"更新角色权限成功",  data: roleDoc})
    } else{
      res.send({code: 1, msg:"更新角色权限失败",  data: roleDoc})
    }
  })
})



module.exports = router;
