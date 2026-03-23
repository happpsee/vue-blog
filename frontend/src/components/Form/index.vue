<template>
  <el-form :model="formFields" ref="formRef" class="p-10 pl-8 pr-8" :rules="validate"
    @keyup.enter="btnAgency('submit')">
    <el-form-item v-for="({ label, type:configType, placeholder, query }) in formConfig" class="pt-2" :prop="query" :label="label"
      :rules="validate[query]">
      <el-input :type="configType" :placeholder="placeholder" v-model="formFields[query]" />
    </el-form-item>

    <div class="btns">
      <el-button v-for="btn in btns" :span="8" @click="btnAgency(btn.name)">
        {{ btn.text }}
      </el-button>
    </div>
  </el-form>
</template>



<script setup>
import { useTemplateRef, watch, ref } from "vue";
import { allConfig } from "./index";
import validateMap from "./config/validate";
defineOptions({
  name: "BaseForm"
});
const type = defineModel("type", {
  required: true
});
const title = defineModel("title", {
  required: true
});
const props = defineProps({
  initFormFields: {
    type: Object,
    default: {}
  },
  handleBtn: {
    type: Function,
    default: () => {}
  }
});

const formRef = useTemplateRef("formRef");

defineExpose({
  elFormRef: formRef
});

const formFields = ref({});
const formConfig = ref({});
const btns = ref([]);
const validate = ref([]);
const curHandleBtnFunc = ref(null);


watch(type, () => {
  title.value = allConfig[type.value].title;
  formConfig.value = allConfig[type.value].formItems;
  btns.value = allConfig[type.value].btns;
  console.log(allConfig[type.value], 'allConfig-type');
  [formFields.value, validate.value] = allConfig[type.value].formItems.reduce((acc, curr) => {
    acc[0][curr.query] = props.initFormFields[curr.query] ?? null;
    console.log(curr.query, 'props.initFormFields');
    acc[1][curr.query] = validateMap[curr.query];
    return acc;
  }, [{}, {}]);
  curHandleBtnFunc.value = props.handleBtn;
    
}, {
  immediate: true
});

const btnAgency = (btnType) => {
  curHandleBtnFunc.value(btnType, formFields.value);
};

</script>


<style scoped lang="stylus">
.el-form
  display flex;
  flex-direction column
  align-items flex-start
  margin-top 30px
  padding-left 40px
  row-gap 20px

:deep(.el-form-item__error)
  margin-top 5px
  
:deep(.el-form-item__label)
  display flex
  align-items center


:deep(.el-input)
  bgColorCommon()
  bdRadius()
  boxSdwCommon()
  width 400px


:deep(.el-input__inner)
  background-color transparent
  padding-left 5px

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
  margin-top 10px

</style>