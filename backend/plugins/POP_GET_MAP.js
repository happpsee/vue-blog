/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-20 16:24:12
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-31 15:56:18
 * @FilePath: \徐晨冰_Node_20250120\第五十天\express-login\plugins\POP_GET_MAP.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const POP_GET_MAP = {
  "Article": {
    "queryAct": "findByIdAndUpdate",
    "options": () => {
      return {
        "$inc": {
          "clickNums": 1
        }
      }
    }
  }
}



const handlePopGet = async (model, _id) => {
  const { queryAct, options } = POP_GET_MAP[model.modelName];
  console.log(queryAct, options());
  await model[queryAct](_id, options());
};

module.exports = {
  POP_GET_MAP,
  handlePopGet,
};