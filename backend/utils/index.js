/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-01-31 14:57:20
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-02-05 20:24:44
 * @FilePath: \第五十五天\blog\backend\utils\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

const path = require("path");
const fs = require("fs");

const padLeft = (value) => {
  value = String(value);
  if (value.length !== 1) {
    return value;
  }
  return '0' + value;
};


const formatTime = (date, format = "yyyy-mm-dd") => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  const regexpMap = {
    "y+": date.getFullYear(),
    "m+": padLeft(date.getMonth() + 1),
    "d+": padLeft(date.getDate()),
    "h+": padLeft(date.getHours()),
    "(?:mi)+": padLeft(date.getMinutes()),
  };

  for (const [key, value] of Object.entries(regexpMap)) {
    format = format.replace(new RegExp(key), value);
  }

  return format; 
};

const findRoot = () => {
  let dirname = __dirname;
  let root = path.parse(dirname).root;

  while (dirname !== root) {
    dirname = path.dirname(dirname);

    if (fs.existsSync(path.join(dirname, "package.json"))) {
      return dirname;
    }
  }
  return process.cwd();
}


module.exports = {
  formatTime,
  findRoot
};