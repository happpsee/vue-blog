<template>
  <div class="classify">
  <Wordcloud v-if="columnData.length > 0" :words="columnData"  :wordClick="navigate"/>
  <el-empty v-else description="暂时没有分类呢~~ 先添加一下分类吧^_^"></el-empty>
  <div class="flex flex-col  items-center gap-y-4 circle-tool absolute top-2 -right-10">
    <el-button :icon="Plus" circle class="tool-item" @click="openClassifyForm"></el-button>
  </div>
  <ClassifyForm ref="classifyForm" @updateClassify="updateClassify"/>
  </div>
</template>



<script setup>
import Wordcloud from "@/components/wordCloud.vue";
import {onBeforeMount, ref, useTemplateRef, inject} from "vue";
import {Plus} from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useArticleStore } from "@/stores/modules/article";
import ClassifyForm from "@/components/Form/classify.vue";
const columnData = ref([]);
const router = useRouter();
const articleStore  = useArticleStore();
const { useApi } = inject('api');



const navigate = async (event, d) =>{
  console.log(d.columnId, "d.columnId");
  await articleStore.getArticels({ 
    column: d.columnId,
  }, {
    reset: true
  });
  router.push("/");
};

const classifyForm = useTemplateRef("classifyForm");
const openClassifyForm = () => {
  classifyForm.value.openAddDialog();
}

//更新分类数据
const updateClassify = () => {
  getColumnData();
};

const getColumnData = async () => {
  let { data } = await useApi("column");
  columnData.value = data.map((item) => {
    return {name:item.name, value: ~~(Math.random() * 100), columnId: item.id}
  });
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