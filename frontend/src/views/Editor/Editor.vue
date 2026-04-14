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
        <el-form  :model="submitForm">

          <el-form-item label="文章封面">
            <el-upload 
            v-model:file-list="submitForm.cover"
            ref="uploadArticleCover"
            :auto-upload="false" 
            :drag="true"
            :limit="1"
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
              :value="column.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="文章摘要", prop="summary">
            <el-input 
            v-model="submitForm.summary"  
            type="textarea"
            placeholder="请输入文章摘要"></el-input>
          </el-form-item>



          <el-form-item class="submit-btns">
            <el-button @click="btnAgency('close')">取消</el-button>
            <el-button type="primary" @click="btnAgency('submit')">提交</el-button>
          </el-form-item>

        </el-form>
      </el-dialog>
    </teleport>

    <teleport to="body">
      <ClassifyForm ref="classifyForm" @updateClassify="updateClassify"/>
    </teleport>

  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useWangEditor } from './compsables/useWangEditor';
import { Plus } from '@element-plus/icons-vue';
import { inject, ref} from 'vue';
import { useEditForm } from './compsables/useEditForm';
import ClassifyForm from "@/components/Form/classify.vue";
defineOptions({
  name: 'ArticleEditor'
});

const { useApi } = inject('api');
const showSubmitDialog = ref(false);
const { editorRef, valueHtml, toolbarConfig, editorConfig, handleCreated } = useWangEditor({useApi});
const { submitForm, columns, articleCoverUrl,  handleExceed, btnAgency, updateClassify } = useEditForm({useApi,  valueHtml, showSubmitDialog});


const submitArticle = () => {
  showSubmitDialog.value = true;
};


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


.el-textarea :deep(textarea) 
  width 330px
  resize none
  field-sizing content
  max-height 200px
  overflow auto
  &::-webkit-scrollbar
    display none
</style>