/**
 * 上传图片保存到本地服务器
 */


const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/'); //当前目录下建立文件夹uploads
    },
    filename: function (req, file, cb) {
      const mimetype = file.mimetype.split('/')[1];
      cb(null, new Date().getTime() + '.' + mimetype);
    }
  });
const upload = multer({ storage }); 

//导出对象
module.exports = upload;

