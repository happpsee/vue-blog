<template>
  <teleport to="body">
    <el-dialog
      title="新增分类"
      v-model="showAddDialog"
      width="30%"
    >
    <el-input v-model="inputColumn" placeholder="请输入分类名称"></el-input>
      <template #footer>
        <el-button type="primary" @click="submitAdd">确定</el-button>
        <el-button @click="closeAddDialog()">取消</el-button>
      </template>
    </el-dialog>
  </teleport>
</template>

<script setup>
import { inject, ref } from "vue";

const { useApi } = inject("api");
const showAddDialog = ref(false);
const inputColumn = ref(null);

const emits = defineEmits(["updateClassify"]);

const closeAddDialog = () => {
  showAddDialog.value = false;  
};
const openAddDialog = () => {
  showAddDialog.value = true;
};

defineExpose({
  openAddDialog,
  closeAddDialog,
})

const submitAdd = async () => {
  try {
    await useApi("addColumn", {
      name: inputColumn.value,
    });
    ElNotification.success({
      title: "新增分类成功",
      message: "新增分类成功",
    })
    emits("updateClassify");
    closeAddDialog();
  } catch(err) {
    ElNotification.error({
      title: "新增分类失败",
      message: err.message,
    })
  }
};
</script>

