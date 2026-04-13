import { defineComponent, ref, inject, watch} from "vue";
import { allConfig } from "@/components/Form";
import loginClass from "./styls/login.module.styl";
import { showSuccessToast, showFailToast } from "vant";
import { useLoginStore } from "@/stores/modules/login";
import { useRoute, useRouter } from "vue-router";

const validateRule = {
  username: [
    { required: true, message: '账号必填'},
    { pattern: /^(?!\d+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{4,12}$/, message: '账号格式 数字+字母 6-8位'}],
  email: [
    { required: true, message: '邮箱必填'},
    { type: 'email', message: '请输入正确的邮箱格式'}],
  password: [
    { required: true, message: '密码必填' },
    { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!.#*?&]{8,12}$/, message: '密码格式 至少包含大写字母+小写字母+数字 8-12位'}]
}


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