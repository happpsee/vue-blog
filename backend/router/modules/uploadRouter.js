/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-28 14:57:34
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-07 15:55:21
 * @FilePath: \第五十三天\express-login\router\modules\uploadRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");

const router = express.Router();

const path = require("path");

const {staticPath, maxFileSize, host} = require("../../config");
const assert = require("http-assert");

const createError = require("http-errors");

const multer = require("multer");
const User = require("../../models/modules/User");


const MulterError_MAP = {
  "LIMIT_FILE_SIZE": `文件大小不得超过 ${maxFileSize} bytes`
};

const FILE_TYPE = {
  "user": "user",
  "article": "article"
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(staticPath, FILE_TYPE[req.params.classify]));
  },
  filename: (req, file, cb) => {
    const {name, ext} = path.parse(file.originalname);
    cb(null, name + "_" + Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: maxFileSize
  }
});


router.post("/:classify", upload.single("file"),(req, res, next) => {
  try {
    let uploadType = FILE_TYPE[req.params.classify];
    assert(uploadType, 400, "文件上传分类不正确");


    console.log(req.file, "req.file是什么");
    let fileUrl = path.join( uploadType, req.file.filename);
    fileUrl = new URL(fileUrl, host).toJSON();

    let {uid} = req.body;

    if (uploadType === "user") {
      //更改user的avatar
      let uid = req.users._id;
      assert(uid, 422, "用户头像必须指定UID");
      console.log("调用");
      User.findByIdAndUpdate(uid, {
        $set: {
          avatar: fileUrl
        }
      }).catch((err) => {
        console.log(err, "错误");
      });
    }

    res.json({
      code: 200,
      data: {
        fileUrl
      },
      timeStamp: Date.now()
    });

  } catch (err) {
    console.log(err, "err是什么");
    next(createError(422, err.message));
  }
}, (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    err.status = 422;
    err.message = MulterError_MAP[err.code];
  }
  next(err);
});

module.exports = {
  uploadRouter: router
}


//  "LIMIT_PART_COUNT"
//  "LIMIT_FILE_COUNT"
//  "LIMIT_FIELD_KEY"
//  "LIMIT_FIELD_VALUE"
//  "LIMIT_FIELD_COUNT"
//  "LIMIT_UNEXPECTED_FILE"
//  "MISSING_FIELD_NAME";