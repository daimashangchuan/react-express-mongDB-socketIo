const express = require('express');
const router = express.Router();
const { CategoryModel, ProductModel } = require('../db/react-admin')
const fs = require('fs');

//  商品管理   ==>
/**
 * 获取商品分页列表
 */
router.post('/list', function (req, res) {
  // 获取请求参数
  const { pageNum, pageSize } = req.body;
  ProductModel.count((err,count) => {
    ProductModel.find({}).skip((pageNum - 1) * pageSize).limit(parseInt(pageSize)||5).sort({'_id':1}).exec((error,productList) => {
      if(error) {
        res.send({code: 1, msg: '请求失败'});
      } else {
        if(productList) {
          const pages = Math.ceil(count/pageSize);
          res.send({code: 0, msg: "加载成功", pageNum, pageSize, count, pages, data: productList});
        } else {
          res.send({code: 1, msg: "加载失败", data: null});
        }
      }
    })
  })
})


/**
 * 获取商品搜索列表
 */
router.post('/search', function (req, res) {
  // 获取请求参数
  const { searchType,searchName, pageNum, pageSize } = req.body;
  const reg = new RegExp(searchName, 'i') //不区分大小写   模糊查询参数
  if(searchType === 'desc') {
    ProductModel.find({ desc: { $regex: reg } }).count((err,count) => {
      ProductModel.find({ desc: { $regex: reg } }).skip((pageNum - 1) * pageSize)
      .limit(parseInt(pageSize)||5).sort({'_id':1}).exec((error,productList) => {
        if(error) {
          res.send({code: 1, msg: '请求失败'});
        } else {
          if(productList) {
            const pages = Math.ceil(count/pageSize);
            //  pageNum请求的第几页     pageSize每页多少    count总数    pages总共多少页
            res.send({code: 0, msg: "加载成功", pageNum, pageSize, count, pages, data: productList});
          } else {
            res.send({code: 1, msg: "加载失败", data: null});
          }
        }
      })
    })
  } else if(searchType === 'name'){
    ProductModel.find({ name: { $regex: reg } }).count((err, count) => {
      ProductModel.find({ name: { $regex: reg } }).skip((pageNum - 1) * pageSize)
      .limit(parseInt(pageSize)||5).sort({'_id':1}).exec((error,productList) => {
        if(error) {
          res.send({code: 1, msg: '请求失败'});
        } else {
          if(productList) {
            const pages = Math.ceil(count/pageSize);
            res.send({code: 0, msg: "加载成功", pageNum, pageSize, count, pages, data: productList});
          } else {
            res.send({code: 1, msg: "加载失败", data: null});
          }
        }
      })
    })
  }
})


/**
 * 商品列表的状态更新
 */
router.post('/updataStatus', function (req, res) {
  const { parentId,status } = req.body;
  ProductModel.findByIdAndUpdate({_id:parentId}, { status }, (error, cateDoc) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateDoc) {
      res.json({code: 0, msg:"更新状态成功",  data: cateDoc});
    } else {
      res.send({code: 1, msg: '更新状态失败'});
    }
  })
})


/**
 * 商品详情获取一级分类名称
 */

router.post('/classOne', function (req, res) {
  const { categoryId } = req.body;
  CategoryModel.findOne({_id:categoryId}, (error, cateDoc) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateDoc) {
      res.json({code: 0, msg:"成功",  data: cateDoc});
    } else {
      res.send({code: 1, msg: '没有一级分类'});
    }
  })
})

/**
 * 商品详情获取二级分类名称
 */

router.post('/classTwo', function (req, res) {
  const { pCategoryId } = req.body;
  CategoryModel.findOne({_id:pCategoryId}, (error, cateDoc) => {
    if(error) {
      res.send({code: 1, msg: '请求失败'});
      return;
    }
    if(cateDoc) {
      res.json({code: 0, msg:"成功",  data: cateDoc});
    } else {
      res.send({code: 1, msg: '没有二级分类'});
    }
  })
})


/**
 *  删除图片    路径问题
 */
router.post('/deleceImg', function (req, res) {
  const { name } = req.body;
  const path = './images/' + name;
  fs.unlinkSync(path,function(err){
    if(!err) {
      res.send({code: 0, msg: '删除图片成功'});
    } else {
      res.send({code: 0, msg: '删除图片失败'});
    }
  });
})

/**
 * 添加商品信息  
 */
router.post('/add', function (req, res) {
  const { name, status, imgs, desc, price, pCategoryId, categoryId, detail } = req.body;
  ProductModel.findOne({name}, (error, proDoc) => {
    if(proDoc) {
      res.send({code: 1, msg: '此商品已存在'})
    } else {
      new ProductModel({ name, status, imgs, desc, price, pCategoryId, categoryId, detail }).save((error, produDoc) => {
        if(error) {
          res.send({code: 2, msg: '商品添加失败'})
        } else{
          res.json({ code: 0, msg: '商品添加成功', data: produDoc })
        }
      })
    }
  })
})

/**
 * 修改商品信息
 */
router.post('/updata', function (req, res) {
  const { _id } = req.body;
  //更新数据库中对应的数据
  ProductModel.findByIdAndUpdate({ _id }, req.body, function (err, proDoc) {
    // const data = {...req.body, _id, username, type}  // node端 ...不可用
    if(err) {
      res.send({code: 2, msg: '商品更新失败'});
    } else {
      res.send({code: 0, msg: '商品更新成功', data:proDoc});
    }
  })
})

module.exports = router;
