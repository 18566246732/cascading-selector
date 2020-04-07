<template>
  <div class="casecading-selector">
    <!--  显示在外部的内容，可以显示组件内部计算的数据值，也可以显示外部传入的显示文字 -->
    <div
      class="casecading-selector-show"
      @click="show = !show"
    >
      {{ showValue }}
    </div>
    <!--  级联选择器外层的容器，用于显示隐藏，以及级联选择器头部和内容的显示 -->
    <div
      v-if="show"
      class="casecading-selector-container"
    >
      <!--  包裹级联选择器的容器 -->
      <div class="casecading-selector-content">
        <!--  使用插槽，将外部的级联选择器显示到当前组件内，成为当前组件的子组件 -->
        <slot />
        <div class="casecading-selector-bg" />
      </div>

      <!--  级联选择器的头部，取消按钮，确定按钮，以及显示的标题 -->
      <div class="casecading-selector-action">
        <div
          class="casecading-selector-action-cancel"
          @click="cancel"
        >
          取消
        </div>
        <div class="casecading-selector-action-title">
          {{ title }}
        </div>
        <div
          class="casecading-selector-action-confirm"
          @click="confirm"
        >
          确定
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CascadingSelector",
  props: {
    value: {
      // 数据双向绑定所必须的属性
      type: Object, // 期待接收一个Object的值
      required: true // 必填的
    },
    showValue: {
      // 由外部定义显示在外层的内容
      type: String,
      default: ""
    },
    title: {
      // 定义级联选择器的标题
      type: String, // 接收字符串类型
      default: "" // 默认为空字符
    }
  },
  data() {
    // 定义oldValue用来保存上一次的值，使用Object.assign拷贝一份，避免与绑定的value发生冲突
    let oldValue = Object.assign({}, this.value);
    return {
      oldValue, // 保存上一次修改的值
      show: false // 定义显示隐藏
    };
  },
  methods: {
    // 取消功能，将上一次的数据发送回外部，并隐藏级联选择器
    cancel() {
      this.$emit("input", this.oldValue);
      this.show = false;
    },
    //  确定功能，将本次修改的值保存，并保存在oldValue中，以供下次使用
    confirm() {
      this.oldValue = Object.assign({}, this.value);
      this.$emit("change", this.value);
      this.show = false;
    },
    // 控制级联选择器显示
    showAddress() {
      this.show = true;
    }
  }
};
</script>

<style lang="scss" scoped>

$casecading-selector-height: 30px;

.casecading-selector {
  letter-spacing: 1px;
  font-size: 16px;
  width: 100%;
  height: $casecading-selector-height;
  line-height: $casecading-selector-height;
  .casecading-selector-show {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-align: left;
    padding-left: 20px;
    text-overflow: ellipsis;
    border: 1px solid grey;
    &::before {
      content: '';
      margin: 10px;
      float: right;
      width: 0;
      cursor: pointer;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: $primary-color transparent transparent transparent;
    }
    &::after {
      float: right;
      content: '';
      border-right: 1px solid grey;
      height: $casecading-selector-height;
    }
  }
  .casecading-selector-container {
    width: 100%;
    background: #fff;
    background: none;
    border: 1px solid grey;
  }
  .casecading-selector-layer {
    position: absolute;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 2;
  }
  ul,
  li {
    margin: 0;
    padding: 0;
    list-style: none;
  }
  .casecading-selector-action {
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: space-between;
    padding: 0 30px;
    border-top: 1px solid grey;
    .casecading-selector-action-cancel {
      color: #e9aa14;
    }
    .casecading-selector-action-confirm {
      color: #508aff;
    }
  }
  .casecading-selector-content {
    display: flex;
    width: 100%;
    justify-content: space-around;
    position: relative;
    height: 400px;
    overflow: hidden;
  }
  .casecading-selector-bg {
    position: absolute;
    top: 136px;
    bottom: 196px;
    z-index: -1;
    background: none;
    left: 0;
    right: 0;
    border-top: 1px solid grey;
    border-bottom: 1px solid grey;
    margin: 0 10px;
  }
  // .casecading-selector-move-enter-to,
  // .casecading-selector-move-leave {
  //   transform: translate3d(0, 0, 0);
  // }
  // .casecading-selector-move-enter-active,
  // .casecading-selector-move-leave-active {
  //   transition: transform 0.6s;
  // }
  // .casecading-selector-move-enter,
  // .casecading-selector-move-leave-to {
  //   transform: translate3d(0, 100%, 0);
  // }
  .casecading-selector-fade-enter-to,
  .casecading-selector-fade-leave {
    opacity: 1;
  }
  .casecading-selector-fade-enter-active,
  .casecading-selector-fade-leave-active {
    transition: opacity 0.4s;
  }
  .casecading-selector-fade-enter,
  .casecading-selector-fade-leave-to {
    opacity: 0;
  }
}
</style>
