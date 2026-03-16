/*
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-15 16:28:42
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-15 16:52:15
 * @FilePath: \blog\frontend\src\views\Article\Detail\compsables\useComment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { ref, computed, inject } from 'vue';
import { ElNotification } from 'element-plus'
import { useLoginStore } from '@/stores/modules/login';


export const useComment = (article) => {
  const { useApi } = inject('api');
  const inputComment = ref(null);
  const userInfo = useLoginStore();
  
  const comments = computed(() => {
    return article?.value?.comments ?? [];
  });

  const uploadComment = async () => {
    try {
      const ans = await useApi('pubComment', {
        'content': inputComment.value,
        'aid': article.value.id,
        'fieldIds': {
          'aid': article.value.id
        }
      });
      article.value.comments.unshift({ ...ans, avatar: userInfo.userInfo.avatar });
      ElNotification.success({
        title: '成功!',
        duration: 2000,
        showClose: false,
        message: '评论添加成功'
      });
    } catch (err) {
      ElNotification.error({
        title: '输入错误!',
        duration: 2000,
        showClose: false,
        message: '请检查输入内容是否有误'
      });
    }
    inputComment.value = null;
  };

  return {
    inputComment,
    comments,
    uploadComment
  }
};