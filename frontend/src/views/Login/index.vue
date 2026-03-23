<template>
  <div class="login">
    <el-dialog 
    v-model="show" 
    :title="title" 
    width="600px" 
    :close-on-press-escape="false"
    :close-on-click-modal="false" 
    @close="closeForm">
      <BaseForm
      ref="baseFormRef"
      v-model:type="type"
      v-model:title="title"
      :handleBtn="handleBtn"
      >
    </BaseForm>
    </el-dialog>
  </div>
</template>


<script setup>
import { useTemplateRef, ref, inject } from 'vue';
import { ElNotification } from 'element-plus';
import BaseForm from "@/components/Form/index.vue";
import { useLoginStore } from "@/stores/modules/login.js";

const show = defineModel("show");
const type = defineModel("type", {
  required: true
});
const title = ref(null);
const loading = ref(false);
const { useApi } = inject('api');
const loginStore = useLoginStore();
const formRef = useTemplateRef('baseFormRef');

const closeForm = () => {
  show.value = false;
};

const handleBtn = async (btnType, data) => {
  if (btnType === "cancel") {
    show.value = false;
    return false;
  }
  
  loading.value = true;
  try {
    await formRef.value.elFormRef.validate();
    const ans = await useApi(type.value, Object.assign({}, data));
    loginStore.login(ans);
    show.value = false;
    ElNotification.success({
      title: `${title.value}成功!`,
      duration: 2000,
      showClose: false,
      message: `欢迎来到博客`,
  });
  } catch (err) {
    console.log(err);
    ElNotification.error({
      title: '提交失败!',
      duration: 2000,
      showClose: false,
      message: '请检查是否填写错误'
    });
  } finally {
    loading.value = false;
  }
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


</style>