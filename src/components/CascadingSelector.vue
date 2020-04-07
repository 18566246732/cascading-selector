<template>
  <div class="casecading-selector">
    <!--  显示在外部的内容，可以显示组件内部计算的数据值，也可以显示外部传入的显示文字 -->
    <div
      class="casecading-selector-show"
      @click="showAddress"
    >
      {{ showValue || defaultShowValue }}
    </div>
    <!--  显示隐藏的移动动画，使用Vue的 transition组件实施 -->
    <transition name="casecading-selector-move">
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
      </div>
    </transition>
    <!--  级联选择器的头部，取消按钮，确定按钮，以及显示的标题 -->
    <div class="casecading-selector-header">
      <div
        class="casecading-selector-header-cancel"
        @click="cancel"
      >
        取消
      </div>
      <div class="casecading-selector-header-title">
        {{ title }}
      </div>
      <div
        class="casecading-selector-header-confirm"
        @click="confirm"
      >
        确定
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
  computed: {
    defaultShowValue() {
      // 定义默认显示的内容，建议使用外部定义的内容显示，内部只做了非常简单的处理
      let arr = [];
      for (let i in this.value) {
        arr.push(i + ":" + this.value[i]);
      }
      return arr.join("/");
    }
  },
  mounted() {
    // Vue实例都拥有的$on方法，监听的是从wrapper发布的changeSelected事件，触发this.changeSelected方法
    this.$on("changeSelected", this.changeSelected);
  },
  // 定义方法
  methods: {
    // 修改当前选中的值，实现数据双向绑定的方法
    changeSelected(prop, value) {
      // 接收两个参数，prop代表需要修改对象的哪个属性，value代表修改的值
      let obj = {};
      obj[prop] = value;
      // 使用Object.assign将新的值与旧的值合并覆盖，并向外部发布新的值
      let obj2 = Object.assign({}, this.value, obj);
      this.$emit("input", obj2);
    },
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
.casecading-selector {
  letter-spacing: 1px;
  font-size: 16px;
  width: 100%;
  height: 100%;
  .casecading-selector-show {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .casecading-selector-container {
    width: 100%;
    background: #fff;
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
  .casecading-selector-header {
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: space-between;
    padding: 0 30px;
    .casecading-selector-header-cancel {
      color: #e9aa14;
    }
    .casecading-selector-header-confirm {
      color: #508aff;
    }
  }
  .casecading-selector-content {
    display: flex;
    width: 100%;
    position: relative;
  }
  .casecading-selector-wrapper {
    flex: 1;
    overflow: hidden;
    & + .casecading-selector-wrapper {
      border-left: 1px solid #ddd;
    }
  }
  .casecading-selector-option {
    line-height: 60px;
    height: 60px;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .casecading-selector-bg {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(
        180deg,
        hsla(0, 0%, 100%, 0.9),
        hsla(0, 0%, 100%, 0.7)
      ),
      linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    backface-visibility: hidden;
    pointer-events: none;
    background-repeat: no-repeat;
    background-position: top, bottom;
    background-size: 100% 100px;
  }
  .casecading-selector-move-enter-to,
  .casecading-selector-move-leave {
    transform: translate3d(0, 0, 0);
  }
  .casecading-selector-move-enter-active,
  .casecading-selector-move-leave-active {
    transition: transform 0.6s;
  }
  .casecading-selector-move-enter,
  .casecading-selector-move-leave-to {
    transform: translate3d(0, 100%, 0);
  }
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
