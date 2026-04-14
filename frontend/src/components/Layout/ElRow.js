
import {h} from 'vue';

export default {
  name: 'ElRow',
  props: {
    width: {
      type: String,
      default: '100%'
    }
  },
  render() {
    const $attrs = this.$attrs;

    return h(ElRow, {
      style: {
        width: this.width
      },
      ...$attrs
    }, {
      default: this.$slots.default
    });
  }
}

