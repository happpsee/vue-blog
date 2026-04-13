//如果传递的是svg图片，则渲染svg图片2
import { ElIcon } from 'element-plus';
import {h} from 'vue';

export default {
  name: 'ElIcon',
  props: {
    custom: {
      type: String
    },
    width: {
      type:String,
      default: "20px"
    },
    height: {
      type: String,
      default: "20px"
    }
  },
  render() {
    //custom是一个打补丁的属性，用于在ElIcon不存在的时候显示别的icon图标
    const $attrs = this.$attrs;

    if (this.custom) {
      return h('img', {
        style: {
          width: this.width,
          height: this.height
        },
        src: this.custom
      });
    }

    console.log(this.$slots, 'thisl');
    return h(ElIcon, {
      ...$attrs
    }, {
      default: () => this.$slots.default()
    });
  }
}