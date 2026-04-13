/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-19 11:31:36
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-02 18:07:55
 * @FilePath: \徐晨冰_Node_20260119\第四十九天\express-login\plugins\POP_POST_MAP.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const { Column, Article, User } = require("../models/index")
const assert = require("http-errors");


const POP_POST_MAP = {
  Comment: [
    {
      "refField": "aid",
      "model": Article,
      "queryAction": "findByIdAndUpdate",
      "updateOptions": ({_id}) => {
        console.log("没有执行吗", _id);
        return {
          $push: {
            "comments": _id
          }
        }
      }
    }
  ],

}



const handleRefUpdate = async ({modelName, refFieldIds, _id }) => {
  if (!(modelName in POP_POST_MAP) || !refFieldIds || !_id) {
    return false;
  }
  let arr = POP_POST_MAP[modelName];

  for (let i = 0, len = arr.length; i < len; i++) {
    let {refField, model, queryAction, updateOptions} = arr[i];
    if (!refFieldIds[refField]) {
      assert(422, `请传入 ${refField} 字段的id`);
    }
    await model[queryAction](refFieldIds[refField], updateOptions({_id}) );
  }
};


module.exports = { handleRefUpdate, POP_POST_MAP };