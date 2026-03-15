<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-03 13:16:36
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-09 13:46:46
 * @FilePath: \blog\frontend\src\views\Login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-03 13:16:36
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-09 13:12:51
 * @FilePath: \blog\frontend\src\views\Login\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="login">
    <el-dialog 
    v-model="show"
    :title="formConfig.title"
    width="600px"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    @close="closeForm">

    <el-form 
    :model="formFields"
    ref="formRef"
    class="p-10 pl-8 pr-8"
    :rules="validate"
    @keyup.enter="handleBtns(formConfig.type)"
    >
      <el-form-item 
      v-for="({label, type, placeholder, query}) in formConfig.formItems"
      class="pt-2"
      :prop="query"
      :label="label"
      :rules="validate[query]"
     >
        <el-input
        :type="type"
        :placeholder="placeholder"
        v-model="formFields[query]"/>
      </el-form-item>

      <div class="btns">
          <el-button
          v-for="btn in formConfig.btns" 
          :span="8" 
          @click="handleBtns(btn.name)">
            {{ btn.text }}
          </el-button>
      </div>


    </el-form>
    </el-dialog>
  </div>
</template>


<script setup>
import { useTemplateRef} from 'vue';
import { useLogin } from './compsables/useLogin';
import { ElNotification } from 'element-plus';


const formRef = useTemplateRef('formRef');

const { formFields, formConfig, login, validate, show } = useLogin();
console.log(validate, 'validate是什么');

const handleBtns = async (type) => {
  if (type === 'close') {
    //TODO: 关闭form
    show.value = false;
    return false;
  }

  try {
    await formRef.value.validate();
    await login();
    show.value = false;
  } catch (err) {
    console.log(err, 'err');
    ElNotification.error({
      title: '输入错误!',
      duration: 2000,
      showClose: false,
      message: '请检查输入内容是否有误'
    });
  }

};


const closeForm = () => {
  formRef.value.resetFields();
};

</script>

<style lang="stylus" scoped>
@import "styles/variable.styl"

:deep(.el-dialog)
  bgColorCommon()
  bdRadius()
  boxSdwCommon()

:deep(.el-dialog__close)
  width 28px
  height 28px

:deep(.el-dialog__close svg)
  font-size 26px


:deep(.el-form)
  display flex;
  flex-direction column
  align-items center
  padding 30px 10px

:deep(.el-form-item)
  align-items center

:deep(.el-form-item__content)
  padding-bottom 10px

:deep(.el-input)
  bgColorCommon()
  bdRadius()
  boxSdwCommon()
  width 400px


:deep(.el-input__inner)
  background-color transparent
  padding 5px

:deep(.el-input__wrapper)
  bdRadius()
  bgColorCommon()
  padding 6px

:deep(.el-button)
  bdRadius()
  bgColorCommon()
  boxSdwCommon()
  position relative
  width 150px
  height 45px
  &:hover
    bd()
    bgColorCommon()
    ttColorCommon()
    transition all .15s
    transform scale(1.05)

.btns
  display flex
  column-gap 20px
  margin-top 20px

</style>