import { defineComponent } from "vue";
import userInfoClass from "./styls/userInfo.module.styl"; 
import { useLoginStore } from "@/stores/modules/login";
import { showConfirmDialog, showSuccessToast } from "vant";
import { useRouter } from "vue-router";

const cellMap = {
  description: (item) => {
    return { title: "个人描述", value: (<van-text-ellipsis rows="3" content={item.description}></van-text-ellipsis>) };
  },
  signature: (item) => {
    return { title: "个性签名", value: item.signature }
  },
  username: (item) => {
    return { title: "账号名", value: item.username }
  },
  email: (item) => {
    return { title: "邮箱", value: item.email }
  },
  articleNum: (item) => {
    return { title: "文章数量", value: item.articleNum }
  },
  readerNum: (item) => {
    return { title: "阅读量", value: item.readerNum }
  },
}

export default defineComponent({
  setup() {
    const loginStore = useLoginStore();
    const router = useRouter();
    console.log(loginStore.userInfo);

    const cellList = Object.entries(cellMap).reduce((acc, [key, value]) => {
      if (key in loginStore.userInfo) {
        acc.push(value(loginStore.userInfo));
      }
      return acc;
    }, []);

    const logout = () => {
      showConfirmDialog({
        title: "退出登录",
        message: "是否退出登录?"
      }).then(() => {
        // on close
        loginStore.logout();
        showSuccessToast("退出登录成功");
        router.replace({name: "mHome"});
      }).catch(() => {})
    }

    return () => (
      <div class={userInfoClass.userInfo}>
        <div className={userInfoClass.topWrap}>
          <van-image
            round
            class={userInfoClass.avatar}
            src={loginStore.userInfo.avatar}
          />
          <p>{loginStore.userInfo.nickname}</p>
        </div>


        <div className={userInfoClass.cellList}>
          {cellList.map((item) => (
            <van-cell title={item.title} value={item.value}></van-cell>
          ))}
          <van-cell title="修改个人信息" is-link onClick={() => router.push({name: "mChangeUser"})}></van-cell>
          <van-cell title="退出登录" is-link onClick={logout}></van-cell>
        </div>


      </div>);
  }
})