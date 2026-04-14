import {h} from 'vue';
export default {
  name: 'ElCol',
  props: {
    justify: {
      type: String,
    },
    align: {
      type: String
    },
    direction: {
      type: String
    },
    colGap: {
      type: String,
      default: "5px"
    },
    rowGap: {
      type: String,
      default: "5px"
    }
  },
  render ()  {
    const $attrs = this.$attrs;

    return h(ElCol, {
      style: this.styles,
      ...$attrs
    }, {
      default: this.$slots.default
  })
  }
}