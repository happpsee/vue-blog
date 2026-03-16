import {ChatLineSquare, Star, Edit, StarFilled} from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus';
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router';

export const useTool = () => {
  const tools = ref({
    "comment": {
      icon: ChatLineSquare,

    }, 
    "star": {
      icon: Star,
      commonIcon: Star,
      activeIcon: StarFilled
    },
    "edit":{
      icon: Edit
    }
});

  const isStar = ref(false);
  const isComment = ref(false);
  const router = useRouter();

  const handleStar = () => {
    isStar.value = !isStar.value;

    if (isStar.value) {
      ElNotification.success({
        title: "成功",
        message: "文章收藏成功"
      });
      tools.value.star.icon = tools.value.star.activeIcon;
      return false;
    }
    tools.value.star.icon = tools.value.star.commonIcon;
    ElNotification.info({
      title: "提示",
      message: "文章已取消收藏"
    })
  }

  const handleComment = () => {
    isComment.value = !isComment.value;
  };

  const handleEdit = () => {
console.log(useRoute());
    router.push({
      path: "/write"
    });

  };

  const toolAgenyMap = {
    "comment": handleComment,
    "edit":  handleEdit,
    "star": handleStar
  }

  const toolAgency = (type) => {
    console.log(type, 'type');
    toolAgenyMap[type] && toolAgenyMap[type]();
  };

  return {
    isComment,
    isStar,
    tools,
    toolAgency
  }
};