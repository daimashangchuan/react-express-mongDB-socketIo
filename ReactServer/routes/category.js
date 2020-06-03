const express = require('express');
const router = express.Router();
const { CategoryModel } = require('../db/react-admin');


//  品牌管理   ==>

/**
 * 获取品牌列表 一级/二级 分类列表
 */
router.post('/list', function (req, res) {
  // 1. 获取请求参数
  const {parentId} = req.body
  // 2. 处理: 根据 parentId 查询 CategoryModel 集合, 如果有, 返回所有分类, 如果没有, 直接返回了一个失败的提示数据, 
  CategoryModel.find({parentId}, (error, cateList) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateList.length != 0) {// 有数据
      res.send({code: 0, data: cateList}); 
    } else {// 没有数据
      res.send({code: 1, msg: '没有数据'});
    }
  })
})

/**
 * 添加列表接口
 */
router.post('/add', function (req, res) {
  // 1. 获取请求参数
  const { parentId,categoryName } = req.body;
  // 2. 处理: 根据 parentId 查询 CategoryModel 集合, 如果有, 修改数据, 如果没有,返回没有这个数据;
  CategoryModel.findOne({name:categoryName}, (error, cateDoc) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateDoc) {// 存在此分类
      res.send({code: 1, msg: '存在此分类，请重新输入'})
    } else {// 此用户不存在 , 可以注册
      new CategoryModel({ parentId, name:categoryName }).save((error, cateDocItem) => {
        // 3. 返回响应(成功)
        res.json({code: 0, msg:"添加成功",  data: cateDocItem})
      })
    }
  })
})

/**
 * 更新分类列表接口
 */
router.post('/update', function (req, res) {
  // 1. 获取请求参数
  const { categoryId,categoryName } = req.body;
  // 2. 处理: 根据 parentId 查询 CategoryModel 集合, 如果有, 修改数据, 如果没有,返回没有这个数据;
  CategoryModel.findByIdAndUpdate({ _id:categoryId }, { name:categoryName }, (error, cateList) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateList) {// 有数据
      res.send({code: 0, msg: "更新成功", data: cateList});
    } else {// 没有数据
      res.send({code: 2, msg: '更新失败'});
    }
  })
})


module.exports = router;
