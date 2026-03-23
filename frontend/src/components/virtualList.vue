<!--
 * @Author: '超绝大帅哥' '3425395584@qq.com'
 * @Date: 2026-03-11 12:52:29
 * @LastEditors: '超绝大帅哥' '3425395584@qq.com'
 * @LastEditTime: 2026-03-13 17:14:31
 * @FilePath: \blog\frontend\src\components\virtualList.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div :style="{ height: props.listHeight + 'px' }" class="container" ref="container" @scroll="scrollEvent">
      <div class="list" :style="{ height: totalHeight  + 'px' }">
        <div class="scroll-list" :style="{ transform: getTransform }">

          <div class="item" v-for="item in visibleList" ref="items" :key="item.item.id" :data-item="item.index">
            <slot :item="item.item"></slot>
          </div>
          <el-skeleton :rows="3"  animated :loading="loading">
          </el-skeleton>
          <el-empty v-if="finished" description="文章已经全部加载完毕啦~~ 没有更多内容了呢^_^"></el-empty>
        </div>
      </div>
    </div> 
</template>


<script setup>
import {ref,  useTemplateRef, computed, onUpdated, toRef, watch} from 'vue';
defineOptions({
  name: 'VirtualList'
});

const props = defineProps({
  estimateHeight: {
    type: Number,
    default: 230
  },
  data: {
    type: Array,
    default: []
  },
  loading: {
    type: Boolean,
    default: false
  },
  finished: {
    type: Boolean,
    default: false
  },
  listHeight: {
    type: Number,
    default: 750
  },
  estimateItemHeight: {
    type: Number,
    default: 260
  },
});

const emit = defineEmits(['loadMore']);
const loading = toRef(() => props.loading); //无线滚动用的
const finished = toRef(() => props.finished);
const threshold = ref(2);
const itemHeight = ref(props.estimateHeight); //子项高度
const length = toRef(() => Math.ceil(props.listHeight / itemHeight.value)); //可视区允许的子项次数
const scrollTop = ref(0);
const start = ref(0);
const itemRefs = useTemplateRef("items");


const list = toRef(() => {
  let itemHeightRaw = itemHeight.value;
  return props.data.map((item, index) => {

    return {
      item,
      index, 
      height: itemHeightRaw,
      top: index * itemHeightRaw,
      bottom: (index + 1) * itemHeightRaw
    }
  });
});


const totalHeight = computed(() => {
  if (list.value.length === 0) {
    return 0;
  }
  return list.value[list.value.length - 1].bottom;
});

watch(start, () => {
  if (start.value + threshold.value + length.value < list.value.length) {
    return false;
  }
  console.log("触发");
  emit('loadMore');
});

const visibleList = computed(() => {
  let beforeStart  = Math.max(start.value - 1, 0);
  let afterEnd = Math.min(start.value + length.value + 1, list.value.length);
  return list.value.slice(beforeStart, afterEnd);
});


onUpdated(() => {
    let nodes = itemRefs.value;
    if (!nodes || nodes.length === 0) {
      return ;
    }
    let minIdx = 0;

    for (let i = 0, dom; dom = nodes[i++]; ) {
      console.log(dom, 'dom是什么看看');
      let index = dom.dataset.item;
      let rect = dom.getBoundingClientRect();
      let height = rect.height;
      let oldHeight = list.value[index].height
      let heightDiff = Math.abs(height - oldHeight);
      if (!minIdx || minIdx >= index) {
        minIdx = index;
      }
      if (heightDiff < 10) {
        list.value[index].height = height;
      }
    }

    let bottom = list.value[Math.max(0, minIdx - 1)].bottom;

    for (let i = minIdx, len = list.value.length; i < len; i++) {
      list.value[i].top = bottom;
      list.value[i].bottom = bottom + list.value[i].height;
      bottom = list.value[i].bottom;
    }

});


const binarySearch = (list, value) => {
  let start = 0;
  let end = list.length;

  while (start < end) {
    let mid = Math.floor((start + end) / 2);

    if (list[mid] < value) {
      start = mid + 1;
    } else {
      end = mid 
    }
  }
  return start;
};

const positions = computed(() => {
  return list.value.map((item) => {
    return item.top;
  });
});


const getTransform = computed(() => {
  return  `translate3d(0, ${scrollTop.value}px,0)`;
});

let lock = false;
const scrollEvent = (event) => {
  if (lock) {
    return false;
  }
  lock = true;
  requestAnimationFrame(() => {
    let scrollTopDiff = event.target.scrollTop;
    let startRow = binarySearch(positions.value, scrollTopDiff) - 1;
    startRow < 0 && (startRow = 0);
    start.value = startRow;
    scrollTop.value = list.value[startRow].top;
    lock = false;
  });
};
</script>


<style scoped lang="stylus">

.container
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar
   width 6px
   cursor pointer
  &::-webkit-scrollbar-thumb
    background-color #dddee0
    opacity .3
    border-radius 10px
    &:hover
      background-color #c7c9cc
.list 
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;


.scroll-list 
  position absolute
  left: 0;
  top: 0;
  right: 0;


.el-skeleton
  padding-top 20px
.el-skeleton :deep(.el-skeleton__item)
  --el-skeleton-color: #ebeced


.el-empty 
  height 200px
</style>
