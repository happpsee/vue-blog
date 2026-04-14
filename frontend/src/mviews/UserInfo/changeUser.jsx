import { defineComponent, ref, inject } from "vue";
import { allConfig } from "@/components/Form/index.js";
import { useLoginStore } from "@/stores/modules/login";
import validateRule from "@/components/Form/config/validateMobile";
import changeUserClass from "./styls/changeUser.module.styl";
import { showSuccessToast, showFailToast, showToast } from "vant";
const userInfoConfig = allConfig["userInfo"].formItems;
import { useRouter } from "vue-router";
let lastTime = 0;

const throttle = (fn, wait = 1000 * 30) => {
  let now = Date.now();
  const effect = async (...args) => {
    now = Date.now();
    let diff = (now - lastTime) < wait;
    if (diff) {
      showToast("操作频繁~~, 半分钟后可继续操作");
      return false;
    }
    await Promise.resolve(fn(...args));
    lastTime = Date.now();
  };
  return effect;
};


export default defineComponent({
  setup() {
    const loginStore = useLoginStore();
    let originUser = userInfoConfig.reduce((acc, curr) => (acc[curr.query] = loginStore.userInfo[curr.query], acc), {});
    const {useApi} = inject("api");
    const formData = ref({...originUser});
    const router = useRouter();

    const requestUserInfo = throttle(async () => {
      const ans = await useApi("changeUserInfo", {...formData.value});
      console.log(ans, "ans");
      loginStore.setUserInfo(ans);
      showSuccessToast("修改提交成功");
      router.back();
    });

    const submit = async () => {

      let change = false;
      for (const [key, value] of Object.entries(originUser)) {
        console.log(value, formData.value[key], value !== formData.value[key]);
        if (value !== formData.value[key]) {
          change = true;
          break;
        }
      }

      if (!change) {
        showFailToast("没有修改任何信息");
        return false;
      }

      await requestUserInfo();
    };

    return () => (
      <div class={changeUserClass.changeUser}>
        <van-form
        onSubmit={submit}>
          {userInfoConfig.map((item) => (<van-field
            name={item.query}
            rules={validateRule[item.query]}
            v-model={formData.value[item.query]}
            type={item.textComp === "textarea" ? "textarea" : item.type}
            maxlength="80"
            show-word-limit={item.textComp === "textarea" ? true : false}
            autosize
            label={item.label}
            label-align="center"
            placeholder={item.placeholder}
          >
          </van-field>))}
          <div style={{ margin: "16PX" }}>
            <van-button size="large" type="primary" native-type="submit">提交修改</van-button>
          </div>
        </van-form>
      </div>
    );
  }
})

