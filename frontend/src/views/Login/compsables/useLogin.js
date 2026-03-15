/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-09 11:49:11
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-10 15:24:04
 * @FilePath: \blog\frontend\src\views\Login\compsables\useLogin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useLoginStore } from "@/stores/modules/login.js";
import { ElNotification } from "element-plus";
import {ref, watch, shallowRef, inject, computed} from 'vue';
import { formConfigMap, validateConfigMap } from "./form.config.js";

export const useLogin = () => {
  const loading = shallowRef(false);
  const {useApi} = inject('api');
  const loginStore = useLoginStore();
  const formFields = ref(null);
  const formConfig = shallowRef(null);
  const validate = shallowRef(null);

  const show = computed({
    get: () => loginStore.show,
    set: (val) => loginStore.changeShow(val)
  })

  watch(() => {
    let curConfig = formConfigMap[loginStore.type];
    formConfig.value = curConfig;

    [formFields.value, validate.value] = (curConfig.formItems.reduce((acc, curr) => {
      acc[0][curr.query] = '';
      acc[1][curr.query] = validateConfigMap[curr.query];
      return acc;
    }, [{}, {}]));
  }, () => loginStore.type, {
    immediate: true
  });


  const login = async () => {
    loading.value = true;
    try {
      const ans = await useApi(loginStore.type, Object.assign({}, formFields.value));
      console.log(ans, 'ans');
      loginStore.setUserInfo(ans);
      
      ElNotification.success({
        title: `${formConfig.value.title}成功!`,
        duration: 3000,
        showClose: false,
        message: `欢迎用户 张三`,
    });
    loginStore.login = true;

    } catch (err) {
      console.log(`${formConfig.value.title}失败`,err );
      ElNotification.error({
        title: `${formConfig.value.title}失败!`,
        duration: 3000,
        showClose: false,
        message: `请检查是否填写错误`
      })
    } finally {
      loading.value = false;
    }
  };

  return {
    formFields,
    formConfig,
    login,
    show,
    validate
  }
};