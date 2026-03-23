/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-21 12:54:24
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-21 14:22:05
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\plugins\POP_PUT_MAP.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const assert = require("http-assert");

const POP_PUT_MAP = {
  "Article": {
    //可修改的字段
    "revisable": ["title", "cover", "content"],
    "authField": "author",
  },
  "User": {
    "revisable": ["username", "password", "email", "avatar", "nickname", "signature", "description"],
    "authField": "_id"
  },
  "Comment": {
    "revisable": ["content"],
    "authField": "uid",
  },
  "Column": {
    "revisable": ["name"],
    "authField": "uid"
  }
};


const handlePopPut = async ({model, userId, data, putData, resourceId}) => {

  let { revisable, authField } = POP_PUT_MAP[model.modelName];

  console.log("看看revisable", revisable, putData);

  assert.equal(userId, data[authField], 403, "无权修改");

  let updateData = revisable.reduce((acc, curr) => {
    if (putData[curr]) {
      //如果请求体包含了可修改的字段
      acc[curr] = putData[curr];
      acc.hasAttribute = true;
    }
    return acc;
  }, { hasAttribute: false });
  
  //没有有效的修改字段
  assert(updateData.hasAttribute, 400, "没有有效修改字段");

  let ans = await model.findByIdAndUpdate(resourceId, updateData, {
    new: true
  });
  return ans;
};


module.exports = {
  POP_PUT_MAP,
  handlePopPut
}