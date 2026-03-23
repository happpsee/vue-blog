<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-20 17:43:53
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-21 13:10:42
 * @FilePath: \k\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="word-cloud"   ref="word-cloud"> </div>
</template>


<script setup>
import cloud from "d3-cloud";
import * as d3 from "d3";
import { ref, useTemplateRef, onMounted, computed, onUpdated } from "vue";

defineOptions({
  name: "WordCloud"
})

const props = defineProps({
  fontSize: {
    type: Array,
    default: [20, 80]
  },
  color: {
    type: Array,
    default: ['#1f77b4', '#629fc9', '#94bedb', '#c9e0ef']
  },
  showToolTip: {
    type: Boolean,
    default: true
  },
  valueKey: {
    type: String,
    default: "value"
  },
  nameKey: {
    type: String,
    default: "name"
  },
  wordClick: {
    type: Function,
    default: () => {}
  },
  words: {
    type: Array,
    default: [
      { name: "Hello", value: 10 },
      { name: "world", value: 20 },
      { name: "normally", value: 30 },
      { name: "you", value: 40, },
      { name: "want", value: 50 },
      { name: "more", value: 60 },
      { name: "words", value: 70 },
      { name: "than", value: 80 },
      { name: "this", value: 90 }
    ]
  }
});

const wordCloudRef = useTemplateRef("word-cloud");
const wordCloudIns = ref(null);
const words = computed(() => {
  return props.words.sort((a, b) => {
    return a.value < b.value ? -1 : 1; 
  });
});
const fontSizeScale = ref(null);
const setFontScale = () => {
  const wordData = words.value;
  fontSizeScale.value = d3.scaleLinear([wordData[0].value, wordData[wordData.length - 1].value], props.fontSize);
};
const colorScale = computed(() => {
  return d3.scaleOrdinal( props.color.map((_, idx) => idx),props.color)
});
const getColor = (index) => {
  return colorScale.value(index % props.color.length);
};

const svgRef = ref(null);
const createChart = () => {
  svgRef.value = d3.select(wordCloudRef.value)
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
};

const toolTip = ref(null);
const createToolTip = () => {
  toolTip.value = d3.select(wordCloudRef.value)
    .append("div")
    .attr("class", "tool-tip")
    .style("opacity", 0);
}


const draw = (data) => {
  const text = svgRef.value
  .append("g")
  .attr("transform", "translate(" + wordCloudIns.value.size()[0] / 2 + "," + wordCloudIns.value.size()[1] / 2 + ")")
  .selectAll("text")
  .data(data)
  .enter()
  .append("text")
  .style("font-size", (d) => d.size + "px")
  .style("font-family", "Impact")
  .style("fill", (_,idx) => getColor(idx))
  .attr("text-anchor", "middle")
  
  text
  .transition()
  .duration(500)
  .attr("transform", (d) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
  .text((d) => d.text);

  if (props.showToolTip) {
    const nameKey = props.nameKey;
    const valueKey = props.valueKey;
    text.on("mouseenter", (event, d) => {
      
      toolTip.value.html(`${nameKey}: ${d[nameKey]} <br/> ${valueKey}: ${d[valueKey]}`);
    }).on("mousemove", (event, d) => {
      toolTip.value
      .style("opacity", 1)
        .style("left", event.pageX + 10 + "px") 
        .style("top", event.pageY + 10 + "px");
    }).on("mouseleave", () => {
      toolTip.value.style("opacity", 0);
    });
  }

  text.on("click", props.wordClick);

};

const init = () => {
  let width = wordCloudRef.value.clientWidth;
  let height = wordCloudRef.value.clientHeight;
  let nameKey = props.nameKey;
  let valueKey = props.valueKey;
  wordCloudIns.value = cloud()
    .size([width, height])
    .words(words.value)
    .padding(10)
    .rotate(function () { return ~~(Math.random() * 2) * 90; })
    .text((d) => { return d[nameKey]} )
    .fontSize(function (d) { return ~~fontSizeScale.value(d[valueKey]); })
    .font("Impact")
    .on("end", draw);
  wordCloudIns.value.start();
};

onUpdated(() => {
  svgRef.value.select("g").remove();
  wordCloudIns.value.stop();
  wordCloudIns.value.words(words.value);
  wordCloudIns.value.start();
});

onMounted(() => {
  setFontScale();
  createChart();
  createToolTip();
  init();
});

</script>


<style>
.word-cloud {
  position: relative;
  cursor: pointer;
}

.tool-tip {
  position: fixed;
  width: 140px;
  padding: 8px;
  font: 18px Arial;
  line-height: 24px;
  color: white;
  background:  #3F3F46;
  border: 0px;
  border-radius: 10px;
  pointer-events: none;
}
</style>