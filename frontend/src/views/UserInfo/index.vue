<template>
  <div class="user-info">
    <h1 class="text-3xl">个人信息中心</h1>




    <div class="user-form">
        <el-avatar
        style="width: 130px; height: 130px;border-radius: 50%;"
        fit="cover"
        class="avatar-uploader-icon"
        :src="avatar"
        @click="openFileManage">
        </el-avatar>

      <BaseForm 
      :initFormFields="useLogin.userInfo"
      v-model:title="title" 
      v-model:type="type" :handleBtn="handleBtn" />
    </div>
  </div>
</template>


<script setup>
import BaseForm from "@/components/Form/index.vue";
import { ref, onBeforeUnmount, inject } from "vue";
import { useLoginStore } from "@/stores/modules/login";
import { useRouter } from "vue-router";

defineOptions({
  name: "UserInfo"
});

const router = useRouter();
const loginStore = useLoginStore();
const {useApi} = inject("api");
const useLogin = useLoginStore();
const title = ref(null);
const type = ref("userInfo");
const avatar = ref(useLogin.userInfo.avatar);
let avatarFile = null;



const handleBtn = async (type, data) => {
  if (type !== "submit") {
    router.push("/");
    return false;
  }
  try {
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      await useApi("uploadUser", formData);
    }

    console.log(data, '看看data');
    const ans = await useApi("changeUserInfo", data);
    loginStore.setUserInfo(ans);
    console.log(ans, 'ans');

    ElNotification.success({
      title: "成功",
      message: "修改提交成功",
      duration: 2000
    });
    // await useApi("changeUserInfo", data);
  } catch (err) {
    ElNotification.error({
      title: "错误",
      message: "修改提交错误",
      duration: 2000
    });
  }
  console.log(data, '看看data');
};


const handleInputFile = (e) => {
  const file = e.target.files[0];
  avatarFile = file;
  if (file) {
    avatar.value = URL.createObjectURL(file);
    console.log(avatar, 'avatar');
  }
}
let input = document.createElement("input");
input.type = "file";
input.addEventListener("change", handleInputFile);

onBeforeUnmount(() => {
  input.removeEventListener("change", handleInputFile);
  input = null;
})

const openFileManage = () => {
  input.click();
}


 

</script>


<style scoped lang="stylus">
@import "styles/variable.styl"
.user-info 
  width 100%
  height 100vh
  padding 20px 0 0 40px
  background-color #ffffff

.user-form
  display flex
  flex-direction column
  align-items center
  margin-top 20px



.el-icon.avatar-uploader-icon {
  bd()
  bgColorCommon()
  boxSdwCommon()
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  text-align: center;
  border-radius 50%
}
</style>