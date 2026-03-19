<template>
    <canvas class="wc-wrap" ref="colud-canvas">

    </canvas>
</template>



<script setup>
import { onBeforeMount, inject, ref, useTemplateRef } from "vue";
import Wordcloud from  "wordcloud";
const wrap = useTemplateRef("colud-canvas");


const { useApi } = inject("api");

onBeforeMount(async () => {
  let { data } = await useApi("column");
  data = data.map(item => {
    return [item.name, item.aids.length ||Math.random() * 20]
  });

  console.log(data, 'data');
   Wordcloud(wrap.value, {
    list: data
  });



});

</script>





<style scoped  lang="stylus">
.wc-wrap
  width 100%
  height 700px
</style>