/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2025-12-16 14:28:53
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 13:28:23
 * @FilePath: \express-login\auth\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const NodeRsa = require("node-rsa");
const Key = require("../models/modules/Key");
const mongoPage = require("mongoose-sex-page");
const assert = require("http-assert");
const jwt = require("jsonwebtoken");


const typeMap = {
  "private": "privateKey",
  "public": "publicKey"
}

const secretKeyMap = {};

const getSecretKey = async (type = "public") => {
  try {
    assert((type in typeMap), 500, "服务端错误");

    const ans = await Key.findOne({
      name: typeMap[type]
    });
    console.log(type, ans, 'type-ans');
    return ans;
  } catch (err) {
    throw err;
  }
};

const setupSecretKey = async () => {
  for(const key of Object.keys(typeMap)) {
    let { content: secretKey } = await getSecretKey(key);
    secretKeyMap[key] = secretKey;
  }
};

//加密指定数据
const encrypt = (data) => {
  const key = new NodeRsa(secretKeyMap["public"]);
  const ans = key.encrypt(data, "base64");
  return ans;
};

//解密指定数据
const decrypt =  (data) => {
  try {
  const key = new NodeRsa(secretKeyMap["private"]);
      // key.setOptions({ encryptionScheme: 'pkcs1_oaep' });
  const ans = key.decrypt(data, "utf8");
  return ans;
  } catch (err) {
    console.log(err, 'decrypt');
    throw err;
  }
};



const openFieldMap = {
  "Article": "title cover clickNums commentNums likeNums date summary",
  "User": "",
  "Column": "name date aids _id"
};

//使用完pagination,完成查询
const pagination = async ({ model, query: selectoQuery = {}} = {}) => {
  let selectField = openFieldMap[model.modelName];
  let { curPages = 1, size = 20,...query} = selectoQuery;
  let { records: data, total, display } = await mongoPage(model).find(query).select(selectField).page(curPages).size(size).exec();
  return {curPages, data, total, display};
}

const getToken = ({username, id}) => {
  return jwt.sign({username, id, exp: Math.floor(Date.now() / 1000) + 24 * 3600 * 3}, secretKeyMap["private"], {algorithm: "RS256"});
}

module.exports = {
  encrypt,
  decrypt,
  pagination,
  setupSecretKey,
  secretKeyMap,
  getToken
}



// const generateKeys = ()=> {
//   const key = new NodeRsa({b: 2048});

//   const publickKey = key.exportKey("pkcs1-public");
//   const privateKey = key.exportKey("pkcs1-private");
//   fs.writeFileSync(path.join(__dirname, "private.cer"), privateKey, "utf8");
//   fs.writeFileSync(path.join(__dirname, "public.cer"),  publickKey,"utf8");
// }
