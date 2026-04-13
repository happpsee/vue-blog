import { defineComponent, onBeforeMount, ref, inject, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import articleClass from "./styls/detail.module.styl";
import { useLoginStore } from "@/stores/modules/login";
import "github-markdown-css/github-markdown-light.css"
import { formatTime } from "@/utils/index.js";
import { showFailToast, showLoadingToast, showToast } from "vant";
import DelayComp from "@/mviews/mcomponents/Delay.jsx";



const Comment = defineComponent({props: ["comments"] , setup(props, {expose}) {
  const listTitle = ref();

  expose({
    listTitle
  });

  return () => (
  <div class={articleClass.commentWrap}>
   { props.comments.length <= 0 ? (<van-empty description="描述文字" />) : (
    <div>
    <h6
    ref={listTitle} 
    class={articleClass.commentTitle}>评论</h6>
    <van-list>
      { props.comments.map(comment => (
        <div>
        <van-cell key={comment.id} >
          <div class={articleClass.userInfo}>
          <van-image class={articleClass.avatar}  round src={comment.uid.avatar} fit="cover"></van-image>
          <div style={{display: "flex", flexDirection: "column"}}>
          <span class={articleClass.nickname}>{comment.uid.nickname}</span>
          <span class={articleClass.commentDate}>{formatTime(comment.date)}</span>          
          </div>
          </div>
        <van-divider  style={{margin: "2PX 0"}}/>
          <div style={{paddingLeft: "10PX"}}>
            {comment.content}
          </div>
        </van-cell>
       </div>
      ))}
    </van-list></div>)}
  </div>);
}});



export default defineComponent({setup() {
  const route = useRoute();
  const {useApi} = inject("api");
  const articleDetail = ref({});
  const commentInput = ref("");
  const loginStore = useLoginStore();
  const router = useRouter();
  const commentList = ref(null);



  const loadFnc = async () => {
    const ans = await new Promise((resolve) => {
      setTimeout(resolve, 300);
    }).then(() => {
      console.log(route.params.id, "发送请求的a")
      return useApi("articleDetail", {
       id: route.params.id
      });
    }); 
    articleDetail.value = ans;
    console.log(articleDetail.value, "articleDetail.value");
    return ans;
  };
  const search = async () => {
    if (!loginStore.isLogin) {
      showFailToast("请先登录"  )
      router.push({name: "mLogin"});
      return false;
    }
    const loading = showLoadingToast({
      message: '加载中...',
      forbidClick: true,
    });
    const ans = await useApi('pubComment', {
        'content': commentInput.value,
        'aid': route.params.id,
        'fieldIds': {
          'aid': route.params.id
        }
      });
      commentInput.value = null;
      console.log(commentList.value.listTitle, "Sdcsnkj");
      commentList.value.listTitle.scrollIntoView({ behavior: "smooth" });
      articleDetail.value.comments.unshift({ ...ans, uid: {avatar: loginStore.userInfo.avatar, nickname: loginStore.userInfo.nickname } });
      loading.close();
     showToast("评论添加成功");
  };


  return () => (
     <div class={articleClass.detail}>
      <DelayComp  loadFnc={loadFnc}>
        {{
          default: (result) => (<div class={articleClass.detail}>
            <h1 class={articleClass.title}>{result.title}</h1>
            <van-divider hairline={false} style={["--van-divider-margin: 5PX"]}/>
            <div class={articleClass.userInfo}>
              <van-image
                round
                width="40PX"
                height="40PX"
                src={result.author.avatar}
              ></van-image>
              <div class={articleClass.right}>
                <p class={articleClass.nickname}>{result.author.nickname}</p>
                <div class={articleClass.articleAbout}>
                   <p class={[articleClass.date, articleClass.aboutItem]}>
                    <i class={articleClass.iconDate}></i>
                    <span>{result.date}</span>
                    </p>
                   <p class={[articleClass.like,articleClass.aboutItem]}>
                    <i class={articleClass.iconLike}></i>
                    <span>{result.likeNums}</span></p>
                   <p class={[articleClass.star, articleClass.aboutItem]}>
                    <i class={articleClass.iconStar}></i>
                    <span>{result.starNums}</span>
                    </p>
                </div>
              </div>
            </div>
            <van-divider hairline={false} style={["--van-divider-margin: 5PX"]}/>
              <div class={[articleClass.content, "markdown-body"]} v-html={result.content}></div>
              <Comment ref={commentList} comments={result.comments} />
          </div>)
        }}
      </DelayComp>

      <div class={articleClass.comment}>
        <van-search
        v-model={commentInput.value}
        left-icon="comment-o"
        show-action
        onSearch={search}
        placeholder="请输入评论内容"
        >
          {{
            action: () => (<div class={articleClass.commentBtn}
            onClick={search}>评论</div>) 
          }}
        </van-search>     
        </div>
      <van-divider hairline={false} style={["--van-divider-margin: 0PX"]}/>
      </div>)
}});