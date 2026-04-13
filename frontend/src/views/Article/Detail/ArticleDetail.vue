
<template>
  <div class="article-container">
    <div class="article-wrapper">
      <el-scrollbar class="article-content">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article?.title }}</h1>

        <!-- 文章元信息 -->
        <div class="article-meta">
          <span class="author-info">
            <el-avatar :size="32" :src="article?.author?.avatar || '/default-avatar.svg'" class="author-avatar"></el-avatar>
            <span class="author-name">{{ article?.author?.nickname }}</span>
          </span>
          <div class="meta-info">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              <span>{{ article?.date }}</span>
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              <span>{{ article?.clickNums }} 阅读</span>
            </span>
           <span class="meta-item">
            <el-icon>
                <component :is="tools.like.icon"></component>
              </el-icon>
              <span>{{ article?.likeNums }} 点赞</span>
            </span>
            <span class="meta-item">
              <el-icon>
                <component :is="tools.star.icon"></component>
              </el-icon>
              <span>{{ article?.starNums }} 收藏</span>
            </span>
          </div>
        </div>

        <!-- 文章内容 -->
        <article class="content markdown-body" data-theme="light" v-html="article?.content"></article>


        <!-- 评论列表 -->
        <div class="comment-section">
          <h2 class="comment-title">评论列表</h2>
          <div class="comment-list">
            <div class="comment-item" v-for="item in comments" :key="item.id">
              <el-avatar :size="40" :src="item.avatar" class="comment-avatar"></el-avatar>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-author">{{ item.author }}</span>
                  <span class="comment-time">{{ item.time }}</span>
                </div>
                <p class="comment-text">{{ item?.content }}</p>
                <div class="comment-actions">
                  <span class="comment-like">
                    <el-icon><Star /></el-icon>
                    <span>{{ item.likes }}</span>
                  </span>
                  <span class="comment-reply">回复</span>
                </div>
              </div>
            </div>
            <div v-if="comments.length === 0" class="no-comments">
              <el-empty description="暂无评论，快来发表第一条评论吧！"></el-empty>
            </div>
          </div>
        </div>

        <!-- 评论输入框 -->
        <transition appear enter-active-class="animate__animated animate__fadeInUp" leave-active-class="animate__animated animate__fadeOutDown">
          <div v-if="isComment" class="comment-form">
            <textarea 
              class="comment-input" 
              @keyup.enter.ctrl="uploadComment"
              resize="none" 
              v-model="inputComment" 
              placeholder="写下你的评论..."
            ></textarea>
            <div class="comment-form-actions">
              <el-button @click="isComment = false">取消</el-button>
              <el-button type="primary" @click="uploadComment">发布评论</el-button>
            </div>
          </div>
        </transition>
      </el-scrollbar>

      <!-- 工具按钮 -->
      <div class="tool-panel">
        <el-button 
          v-for="(value, key) in tools" 
          class="tool-item" 
          :key="key"
          circle  
          :icon="value.icon" 
          @click="toolAgency(key)"
          :title="value.title"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router';
import {onBeforeMount, ref, inject} from 'vue';
import "github-markdown-css/github-markdown-light.css"
import { useTool } from './compsables/useTool';
import { useComment } from './compsables/useComment';
import { Calendar, View, Star } from '@element-plus/icons-vue';
import { getArticles, addArticles } from "@/stores/modules/keepArticle";
defineOptions({
  name: "ArticeDetail"
});

const { useApi } = inject("api");
const route = useRoute();
const article = ref(null);
const { isComment, tools, toolAgency } = useTool({article, useApi, id: route.params.id});
const { inputComment, comments, uploadComment} = useComment(article);


onBeforeMount(async () => {
  let ans = getArticles(route.params.id);


  if (!ans) {
    ans = await useApi("articleDetail", {
      id: route.params.id
    });
    addArticles(route.params.id, ans);
  }
  article.value = ans;

  console.log("看看article.value", article.value);
})

</script>

<style lang="stylus" scoped>
@import "styles/variable.styl";

.article-container
  position relative
  transform translate3d(0, 0, 0)
  width 100%
  min-height 100vh
  bgColorCommon()
  background-color #fffff

.article-wrapper
  max-width 800px
  margin 0 auto
  position relative
  background-color #FFFFFF
  border-radius border_radius_lg
  box-shadow shadow_md
  overflow auto
  transition transition_default
  &:hover
    box-shadow shadow_lg

.article-content
  padding spacing_2xl
  max-height 800px

.article-title
  font-size 2.5rem
  font-weight 700
  color primary_color
  margin-bottom spacing_xl
  line-height 1.2
  word-break break-word

.article-meta
  display flex
  align-items center
  justify-content space-between
  margin-bottom spacing_xl
  padding-bottom spacing_lg
  border-bottom 1px solid border_color

.author-info
  display flex
  align-items center
  gap spacing_sm

.author-avatar
  border 2px solid rgba(37, 99, 235, 0.1)

.author-name
  font-weight 600
  color text_color

.meta-info
  display flex
  align-items center
  gap spacing_lg

.meta-item
  display flex
  align-items center
  gap spacing_xs
  color text_color_secondary
  font-size 0.875rem
  .el-icon
    font-size 1rem

.content
  margin-bottom spacing_2xl
  line-height 1.8
  .markdown-body
    width 100%
    color text_color
    h2, h3, h4, h5, h6
      color primary_color
      margin-top spacing_xl
      margin-bottom spacing_md
    p
      margin-bottom spacing_md
    img
      max-width 100%
      border-radius border_radius_md
      margin spacing_md 0
    code
      display block
      max-height 300px
      white-space pre-wrap
      margin spacing_md 0
      padding spacing_md
      background-color rgba(0, 0, 0, 0.05)
      border-radius border_radius_sm
      font-family 'Monaco', 'Menlo', 'Ubuntu Mono', monospace

.article-actions
  display flex
  gap spacing_md
  margin bottom spacing_2xl
  padding top spacing_xl
  border-top 1px solid border_color

.action-button
  flex 1
  max-width 150px
  border-radius border_radius_md
  transition transition_default

.like-button
  &:hover
    background-color #F43F5E
    border-color #F43F5E

.comment-section
  margin-top spacing_2xl
  padding top spacing_2xl
  border-top 1px solid border_color

.comment-title
  font-size 1.5rem
  font-weight 600
  color primary_color
  margin-bottom spacing_xl

.comment-list
  display flex
  flex-direction column
  gap spacing_lg

.comment-item
  display flex
  gap spacing_md
  padding spacing_md
  background-color bg_color
  border-radius border_radius_md
  transition transition_default
  &:hover
    background-color rgba(0, 0, 0, 0.02)

.comment-avatar
  flex-shrink 0

.comment-content
  flex 1

.comment-header
  display flex
  justify-content space-between
  align-items center
  margin-bottom spacing_sm

.comment-author
  font-weight 600
  color text_color

.comment-time
  font-size 0.75rem
  color text_color_secondary

.comment-text
  color text_color
  line-height 1.6
  margin-bottom spacing_sm

.comment-actions
  display flex
  gap spacing_lg
  font-size 0.875rem

.comment-like
  display flex
  align-items center
  gap spacing_xs
  color text_color_secondary
  cursor pointer
  transition transition_default
  &:hover
    color cta_color

.comment-reply
  color text_color_secondary
  cursor pointer
  transition transition_default
  &:hover
    color cta_color

.no-comments
  padding spacing_2xl
  text-align center

.comment-form
  position fixed
  bottom 120px
  left 0
  width 100%
  margin-top spacing_xl
  padding spacing_lg
  background-color bg_color
  border-radius border_radius_md

.comment-input
  width 100%
  min-height 100px
  max-height 300px
  padding spacing_md
  border 1px solid border_color
  border-radius border_radius_md
  resize none
  font-family font_family
  font-size 0.875rem
  line-height 1.5
  color text_color
  transition transition_default
  field-sizing content
  &:focus
    outline none
    border-color cta_color
    box-shadow 0 0 0 2px rgba(37, 99, 235, 0.1)

.comment-form-actions
  display flex
  justify-content flex-end
  gap spacing_md
  margin-top spacing_md

.tool-panel
  position fixed
  top 120px
  right -70px
  display flex
  flex-direction column
  gap spacing_sm
  z-index 100

.tool-panel :deep(.el-button+.el-button)
  margin-left 0
.tool-panel :deep(.el-button.is-circle)
  width 48px

.tool-item
  width 48px
  height 48px
  border-radius 50%
  background-color #FFFFFF
  box-shadow shadow_md
  transition transition_default
  &:hover
    background-color cta_color
    color #FFFFFF
    box-shadow shadow_lg

@media (max-width: 768px)
  .article-container
    padding spacing_xl 0
  
  .article-wrapper
    margin 0 spacing_sm
  
  .article-content
    padding spacing_xl
  
  .article-title
    font-size 2rem
  
  .article-meta
    flex-direction column
    align-items flex-start
    gap spacing_md
  
  .meta-info
    gap spacing_md
  
  .tool-panel
    position fixed
    bottom spacing_lg
    top auto
    right 50%
    transform translateX(50%)
    flex-direction row
    background-color rgba(255, 255, 255, 0.95)
    padding spacing_sm
    border-radius border_radius_lg
    box-shadow shadow_md
  
  .tool-item
    width 40px
    height 40px

.el-scrollbar
  overflow auto

</style>
