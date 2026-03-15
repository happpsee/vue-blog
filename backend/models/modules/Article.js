/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-31 14:57:20
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-10 16:41:30
 * @FilePath: \徐晨冰_Node_20260202\第五十五天\blog\backend\models\modules\Article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEimp
 */
/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-19 11:26:17
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-01-21 15:24:37
 * @FilePath: \徐晨冰_Node_20260119\第四十九天\express-login\models\modules\Article.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const mongoose = require("mongoose");
const { formatTime } = require("../../utils");

const schema = new mongoose.Schema({
  title: {
    type: mongoose.SchemaTypes.String,
    required: [true, "必须填写文章标题"],
    default: () => {
      return "默认标题" + Date.now();
    }
  },
  //封面
  cover: {
    type: mongoose.SchemaTypes.String
  },
  summary: {
    type: mongoose.SchemaTypes.String,
    default: `JavaScript语言有很多复杂的概念，但却用简单的方式体现出来（比如回调函数），因此，JavaScript开发者无需理解语言内部的原理，就能编写出功能全面的程序；就像收音机一样，你无需理解里面的管子和线圈都是做什么用的，只要会操作收音机上的按键，就可以收听你喜欢的节目。然而，JavaScript的这些复杂精妙的概念才是语言的精髓，即使是经验丰富的JavaScript开发者，如果没有认真学习也无法真正理解语言本身的特性。正是因为绝大多数人不求甚解，一遇到出乎意料的行为就认为是语言本身有缺陷，进而把相关的特性加入黑名单，久而久之就排除了这门语言的多样性，人为地使它变得不完整、不安全。

“你不知道的JavaScript”系列就是要让不求甚解的JavaScript开发者迎难而上，深入语言内部，弄清楚JavaScript每一个零部件的用途。本书介绍了该系列...`
  },
  //文章内容
  content: {
    type: mongoose.SchemaTypes.String,
    required: [true, "必须填写文章内容"],
    set: (val) => {
      return val.replace(/\"/gi, "'");
    }
  },
  //更新
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      console.log(val, "Val");
      return formatTime(Date(val));
    }
  },
  //点击量
  clickNums: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  //评论量
  commentNums: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  //点赞量
  likeNums: {
    type: mongoose.SchemaTypes.Number,
    default: 0
  },
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
      default: []
    }
  ],
  column: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Column",
    default: "暂无分栏"
  }
})

schema.set("toJSON", {getters: true});
module.exports = mongoose.model("Article", schema);


