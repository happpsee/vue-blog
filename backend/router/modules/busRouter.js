/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-13 21:11:46
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-14 13:34:25
 * @FilePath: \徐晨冰_Node_20260113\第四十六天\express-login\router\modules\busRouter.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require("express");
const router = express.Router();

const {pagination} = require("../../core/index");
const createError = require("http-errors");
const {handleRefUpdate, POP_POST_MAP} = require("../../plugins/POP_POST_MAP");
const {  POPULATE_MAP } = require("../../plugins/POPULATE_Map");
const mongoose = require("mongoose");
const { handlePopGet, POP_GET_MAP } = require("../../plugins/POP_GET_MAP");
const {UID_MAP} = require("../../plugins/UID_MAP.js");
const assert = require("http-assert");
const { POP_PUT_MAP, handlePopPut } = require("../../plugins/POP_PUT_MAP");
const RESOURCE_POST_MAP = require("../../plugins/RESOURCE_POST_MAP");


//查询列表分页
router.get("/", async (req, res, next) => {

  let  query = req.query;
  try {

    let model = req.Model;
    if (model.modelName in UID_MAP) {
      console.log(req.users._id, "Req.userID");
      assert(req.users._id, 403, "没有权限");
      query = { [UID_MAP[model.modelName]]: req.users._id, ...query};
    }

    const ans = await pagination({
      query,
      model
    });
    console.log(ans, 'ans');

    res.json({
      code: 200,
      data: ans,
      timestamp: Date.now()
    });
  } catch (err) {
    console.log(err, "err");
    next(createError(422, err.message || "请求错误"));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    assert(req.params.id, "找不到id");

    let modelName = req.Model.modelName;
    
    if (modelName in POP_GET_MAP) {
      await handlePopGet(req.Model, req.params.id);
    }

    if (modelName in POPULATE_MAP) {
      let populates =  POPULATE_MAP[modelName];
      const result = await req.Model.findById(req.params.id).populate(populates);
      res.json({
        code: 200,
        data: result,
        timestamp: Date.now()
      });
      return false;
    }

    const result = await req.Model.findById(req.params.id);
    res.json({
      code: 200,
      data: result,
      timestamp: Date.now()
    });

  } catch (err) {
    next(createError(422, err.message || "查询错误"));
  }
});


//创建资源
router.post("/", async (req, res, next) => {
  console.log(req, 'req, ');
  try {

    let body = req.body;
    let modelName = req.Model.modelName

    if (modelName in UID_MAP) {
      body[UID_MAP[modelName]] = req.users._id;
    }

    if (modelName in RESOURCE_POST_MAP) {
      body = RESOURCE_POST_MAP[modelName]["body"](req);
    }
    
    console.log(body, "body为");
    const ansModel = await req.Model.create(body);

    let { fieldIds } = body;
    let _id = ansModel._id;
    if (modelName in POP_POST_MAP) {
      await handleRefUpdate({
        modelName,
        refFieldIds: fieldIds,
        _id
      });
    }

    res.json({
      code: 200,
      data: ansModel,
      timestamp: Date.now()
    });
    
  } catch (err) {
    console.log(err);
    if (err instanceof mongoose.Error.ValidationError) {
      //自定义的验证错误
     const ans = Object.entries(err.errors).reduce((acc, [key, value]) => {
        acc[key] = value.message;
        return acc;
      }, {});
      next(createError(422, JSON.stringify(ans)));
      return false;
    }
    next(createError(400, "添加失败"));
  }
});


//更改资源
router.put("/:id", async (req, res, next) => {
  try {
    let id = req.params.id; //资源id
    let userId = req.userId;
    let modelName = req.Model.modelName;
    let putData = req.body;

    let data = await req.Model.findById(id);
    assert(data, 404, "资源不存在");
    
    if (modelName in POP_PUT_MAP) {
       data = await handlePopPut({model: req.Model, userId, data, putData, resourceId: id});
    }
    
    res.json({
      code: 200,
      data,
      message: "修改成功",
      timestamp: Date.now()
    })
  } catch (err) {
    next(createError(err.status || 422, err.message || "修改失败"));
  }
});

router.delete(":id", async (req, res) => {
  try {
    await req.Model.findByIdAndRemove(req.params.id);

    res.json({
      code: 200,
      data: "删除成功",
      timestamp: Date.now()
    })

  } catch (err) {
    res.json({
      code: 404,
      data: "删除失败,或未找到",
      timestamp: Date.now()
    })
  }
});


module.exports = {
   busRouter:router
}