/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-04 19:47:11
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-07 17:25:17
 * @FilePath: \徐晨冰_Vue_20260302\第二十一天\blog\src\utils\modules\rsaKey.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import forge from 'node-forge';

export const encrypt = (publicKey, value) => {
  const publicKeyPem = forge.pki.publicKeyFromPem(publicKey); 

  value = publicKeyPem.encrypt(value, "RSA-OAEP");

  const encrypted = forge.util.encode64(value);
  console.log(encrypted)
  return encrypted;
};