import { defineComponent, ref, inject, watch} from "vue";
import { allConfig } from "@/components/Form";
import loginClass from "./styls/login.module.styl";
import { showSuccessToast, showFailToast } from "vant";
import { useLoginStore } from "@/stores/modules/login";
import { useRoute, useRouter } from "vue-router";
import validateRule from "@/components/Form/config/validateMobile";



const FormComp = defineComponent({ emits: ["submit"],props: ["type"],setup: (props, {emit}) => {
  const config = ref({});
  const formData = ref({});


  watch(() => props.type, () => {
    config.value = allConfig[props.type].formItems;
    formData.value = config.value.reduce((acc, curr) => (acc[curr.query] = null, acc), {});
  }, {immediate: true});


  const failed = () => {
    console.log("failed");
    showFailToast("请检查表单是否填写错误");
  }

  return () => (
    <van-form
    onSubmit={() => emit("submit", {...formData.value})}
    onFailed={failed}>
      { config.value.map((item) => (
        <van-field
        name={item.query}
        rules={validateRule[item.query]}
        v-model={formData.value[item.query]}
        type={item.type}
        label={item.label}
        label-align="center"
        placeholder={item.placeholder}
        >
        </van-field>
      ))}
      <div style={{margin: "16PX"}}>
      <van-button size="large" type="primary" native-type="submit">提交</van-button>
      </div>

    </van-form>
  )
}});

export default defineComponent(() => {
  const type = ref("login");
  const {useApi} = inject("api");
  const loginStore = useLoginStore();
  const route = useRoute();
  const router = useRouter();
  console.log("loginStore", route);

  const submit = async (formData) => {
    console.log(formData, "formData");
    try {
      const ans = await useApi(type.value, formData);
      loginStore.login(ans)
      console.log(ans, "ans");
      showSuccessToast("登录成功");
      router.back();
    } catch (err) {
      showFailToast("登录失败");
    }
  }


  return () => (
    <div class={loginClass.loginWrap}>
        {/* <van-image class={loginClass.logo} src="/logo.png" fit="cover"></van-image> */}
      <div class={loginClass.formWrap}>
              <van-cell-group inset>
      <van-tabs v-model:active={type.value}>
        <van-tab   name="login" title="登录" />
        <van-tab   name="registry" title="注册" />
      </van-tabs>
      <FormComp type={type.value} onSubmit={submit} />
      </van-cell-group>
      </div>
    </div>
  )
})