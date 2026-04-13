<template>
  <div class="live2d-wrap">

    <div class="live2d-menu flex gap-x-4">
      <el-text type="primary" @click="changeModel">切换模型</el-text>
      <el-text type="primary" @click="changeTextures">切换材质</el-text>
    </div>

    <canvas
    id="live2d"
    width="300"
    height="300">
  </canvas>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import "@/static/js/live2d.js";
import axios from "axios";

const GET_URL = "https://live2d.fghrsh.net/api/get/";
const MODEL_URL = "http://api.fghrsh.net/live2d/switch/";
const TEXTURES_URL = "https://api.fghrsh.net/live2d/rand_textures/";

let modelId = ref(1);
let texturesId = ref(0);
onMounted(() => {
  loadModel();
});

async function changeModel() {
  try {
    let result = await axios.get(`${MODEL_URL}?id=${modelId.value}`);
    let model = result.data?.model;
    modelId.value = model.id;
    loadModel();
  } catch (err) {
    resetModel();
  }
}
async function changeTextures() {
  try {
    let result = await axios.get(`${TEXTURES_URL}?id=${modelId.value}`);
    texturesId.value = result.data?.textures.id;
    loadModel();
  } catch (err) {
    resetModel();
  }
}
function resetModel() {
  modelId.value = 1;
  texturesId.value = 0;
  loadModel();
}
function loadModel() {
  loadlive2d("live2d", `${GET_URL}?id=${modelId.value}-${texturesId.value}`);
}



onMounted(() => {
  loadModel();
});

</script>


<style scoped lang="stylus">
</style>