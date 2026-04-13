import {ChatLineSquare, Star, Edit, StarFilled} from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus';
import {ref, h,  onBeforeUnmount, computed} from 'vue';
import {useRouter} from 'vue-router';
import ElIcon from "@/components/ICon/ElIcon.js";
import store from "store";
import { useArticleStore } from '@/stores/modules/article';

export const useTool = ({article, useApi, id}) => {

  const likeIconComp = h(ElIcon, {custom:"like2.svg"});
  const likeSelectIconComp = h(ElIcon, {custom:"like2_select.svg"});


  const articleStore = useArticleStore();
  let articleStars = store.get("articleStar") || [];
  let articleLikes = store.get("articleLike") || [];
  const isStar = ref(articleStars.includes(id) || false);
  const isLike = ref(articleLikes.includes(id) || false);
  const isComment = ref(false);
  let changeStar = false;
  let changeLike = false;

  const tools = computed(() => {
    return {
    "comment": {
      icon: ChatLineSquare,
    }, 
    "star": {
      icon: isStar.value ? StarFilled : Star,
    },
    "like": {
      icon: isLike.value ? likeSelectIconComp : likeIconComp,
    },
    "edit":{
      icon: Edit
    }
  }
});
  const router = useRouter();
  const handleStar = () => {
    isStar.value = !isStar.value;
    changeStar = isStar.value ? 1 : -1;
    if (isStar.value) {
      ElNotification.success({
        title: "成功",
        message: "文章收藏成功"
      });
      article.value.starNums += 1;
      return false;
    }
    article.value.starNums -= 1;
    ElNotification.info({
      title: "提示",
      message: "文章已取消收藏"
    })
  }

  const handleComment = () => {
    isComment.value = !isComment.value;
  };

  const handleEdit = () => {
    router.push({
      path: "/write"
    });
  };

  const handleLike = () => {
    isLike.value = !isLike.value;
    changeLike = isLike.value ? 1 : -1;
    article.value.likeNums = isLike.value ? article.value.likeNums + 1 : article.value.likeNums - 1;
  }


  const toolAgenyMap = {
    "comment": handleComment,
    "edit":  handleEdit,
    "like": handleLike,
    "star": handleStar
  }



  const toolAgency = (type) => {
    console.log(type, 'type');
    toolAgenyMap[type] && toolAgenyMap[type]();
  };



   onBeforeUnmount(async () => {

    if (isStar.value) {
      (!articleStars.includes(id)) && articleStars.push(id)
    } else {
      articleStars.includes(id) && (articleStars = articleStars.filter(item => item !== id));
    }
    if (isLike.value) {
      (!articleLikes.includes(id)) && articleLikes.push(id)
    } else {
      articleLikes.includes(id) && (articleLikes = articleLikes.filter(item => item !== id));
    }
    store.set("articleStar", articleStars);
    store.set("articleLike", articleLikes);
   

    if (changeLike || changeStar) {
      let query = {path: `/article/like/${id}`};
      changeLike && (query.like = changeLike);
      changeStar && (query.star = changeStar);

      const article = await useApi("articleLike", query);
      console.log(article, 'article');

      articleStore.articles = articleStore.articles.map(item => {
        if (item.id === id) {
          return article;
        }
        return item;
      });
    }

  });

  return {
    isComment,
    isStar,
    tools,
    toolAgency
  }
};