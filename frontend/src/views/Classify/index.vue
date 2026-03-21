<template>
  <div class="classify">
  <Wordcloud v-if="columnData.length > 0" :words="columnData"  :wordClick="navigate"/>
  
  <div class="flex flex-col  items-center gap-y-4 circle-tool absolute top-2 -right-10">
    <el-button :icon="Plus" circle class="tool-item" @click="openAddDialog"></el-button>
  </div>
  </div>


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
import Wordcloud from "@/components/wordCloud.vue";
import {inject, onBeforeMount, ref} from "vue";
import {Plus} from "@element-plus/icons-vue";
import { ElNotification } from "element-plus";
import { useRouter } from "vue-router";

const { useApi } = inject("api");
const columnData = ref([]);
const showAddDialog = ref(false);
const inputColumn = ref(null);
const router = useRouter();

const closeAddDialog = () => {
  showAddDialog.value = false;  
};
const openAddDialog = () => {
  showAddDialog.value = true;
};

const navigate = (event, d) =>{
  console.log(d.columnId);
  router.push({
    path: "/article",
    query: {
      columnId: d.columnId
    }
  })
};

const getColumnData = async () => {
  let { data } = await useApi("column");
  columnData.value = data.map((item) => {
    return {name:item.name, value: ~~(Math.random() * 100), columnId: item._id}
  });
};

const submitAdd = async () => {
  console.log(inputColumn.value, "inputColumn.value");
  try {
    await useApi("addColumn", {
      name: inputColumn.value,
    });
    ElNotification.success({
      title: "新增分类成功",
      message: "新增分类成功",
    })
    await getColumnData();
    closeAddDialog();
  } catch(err) {
    ElNotification.error({
      title: "新增分类失败",
      message: err.message,
    })
  }

};

onBeforeMount(async () => {
  await getColumnData();
});

</script>





<style scoped  lang="stylus">

.classify
  width 100%
  height 100%

.word-cloud
  width 100%
  height 100%
  
.tool-item
  margin-left 0 !important
  &:hover
    border 1px solid #ececec
    background-color oklch(92.9% 0.013 255.508)
</style>