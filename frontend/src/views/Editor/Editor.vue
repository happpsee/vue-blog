<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-15 17:02:41
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 18:27:13
 * @FilePath: \blog\frontend\src\views\Editor\Editor.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="editor-wrap">
    <Toolbar class="tool-bar" :editor="editorRef" :defaultConfig="toolbarConfig" />
    <Editor class="editor-content" style="height: 580px;" v-model="valueHtml" :defaultConfig="editorConfig"
      @onCreated="handleCreated" />

    <div class="tool-btn flex justify-end mt-10">
      <el-button class="tool-item" @click="submitArticle">
        发布文章
      </el-button>
    </div>

    <teleport to="body">
      <el-dialog 
      v-model="showSubmitDialog" 
      title="文章上传" 
      :width="600"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
        <el-form ref="submitForm" :model="submitForm">

          <el-form-item label="文章封面" prop="cover">
            <el-upload 
            v-model:file-list="submitForm.cover"
            ref="uploadArticleCover"
            :auto-upload="false" 
            :drag="true"
            :limit="1"
            :on-success="handleCoverSuccess"
            :on-exceed="handleExceed">
            <img v-if="articleCoverUrl" class="article-cover" :src="articleCoverUrl">
              <el-icon v-else class="upload-icon">
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>

          <el-form-item label="文章标题" prop="title">
            <el-input v-model="submitForm.title" placeholder="请输入文章标题"></el-input>
          </el-form-item>

          <el-form-item label="文章分类" prop="column">
            <el-select
            v-model="submitForm.column"
            placeholder="请选择文章分类"
            label="这是label">
              <el-option 
              v-for="column in columns"
              :key="column._id"
              :label="column.name"
              :value="column._id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="submit-btns">
            <el-button @click="btnAgency('close')">取消</el-button>
            <el-button type="primary" @click="btnAgency('submit')">提交</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </teleport>

  </div>
</template>

<script setup>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import "@wangeditor/editor/dist/css/style.css";
import { useWangEditor } from './compsables/useWangEditor';
import { Plus } from '@element-plus/icons-vue';
import { ElNotification } from 'element-plus';
import { inject, ref, useTemplateRef, computed, onBeforeMount } from 'vue';

defineOptions({
  name: 'ArticleEditor'
});

const { editorRef, valueHtml, toolbarConfig, editorConfig, handleCreated } = useWangEditor();
const { useApi } = inject('api');
const showSubmitDialog = ref(false);
const submitFormRef = useTemplateRef("submitForm");
const uploadArticleCoverRef = useTemplateRef("uploadArticleCover");
const columns = ref(null);
//表单数据
const submitForm = ref({
  title: "",
  cover: "",
  column: ""
});

const articleCoverUrl = computed(() => {
  if (!submitForm.value.cover || submitForm.value.cover.length <= 0) {
    return false;
  }
  let coverURL = URL.createObjectURL(submitForm.value.cover[0]?.raw);
  return coverURL;
});

const handleExceed =  (rawFile) => {
  uploadArticleCoverRef.value.clearFiles();
  uploadArticleCoverRef.value.handleStart(rawFile[0]);
};


onBeforeMount(async () => {
  const { data } = await useApi("column");
  columns.value = data;
  console.log(data, 'data是什么');
});



const submitArticle = () => {
  showSubmitDialog.value = true;
};

const btnAgency = async (type) => {
  if (type === 'close') {
    showSubmitDialog.value = false;
    return false;
  }
    console.log(submitForm.value, 'submitForm.value');

    const coverFormdata = new FormData();
  
    coverFormdata.append("file", submitForm.value.cover[0].raw);
    let coverURL = "";
    try {
     const ans = await useApi('uploadArticleCover', coverFormdata);
     coverURL = ans.fileUrl;
    } catch (err) {
      console.log(err, 'err');
      ElNotification.error({
        title: '上传封面失败!',
        duration: 2000,
        showClose: false,
        message: '请检查封面是否符合要求'
      });
      return false;
    }
    try {
    await useApi('articleAdd', {
      title: submitForm.value.title,
      cover: coverURL,
      content: editorRef.value.getHtml(),
      column: submitForm.value.column,
    });
    ElNotification.success({
      title: '发布文章成功!',
      duration: 2000,
      showClose: false,
      message: '文章发布成功'
    });
      showSubmitDialog.value = false;
      uploadArticleCoverRef.value.clearFiles();
    } catch (err) {
      console.log(err, 'err');
      ElNotification.error({
        title: '发布文章失败!',
        duration: 2000,
        showClose: false,
        message: '请检查文章内容是否有误'
      });
      return false;
    }


}

</script>


<style lang="stylus" scoped>
@import "styles/variable.styl";


.tool-bar
   bd()

.editor-content
  bd()



.tool-item
  padding 20px

.el-button
  &:hover 
    border 0
    background-color oklch(92.9% 0.013 255.508)

.el-form
  width 400px
  margin 10px auto
  padding 10px
.el-form-item 
  width 400px


.upload-icon
  width 120px

.el-form-item :deep(.el-upload .el-upload-dragger)
  min-width 10px
  padding 5px

.article-cover
  max-width 300px
  max-height 200px

.submit-btns :deep(.el-form-item__content)
  display flex
  justify-content flex-end

</style>