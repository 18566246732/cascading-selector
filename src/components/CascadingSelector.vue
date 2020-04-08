<template>
  <div class="casecading-selector">
    <div
      class="casecading-selector-show"
      @click="show = !show"
    >
      {{ showValue }}
    </div>
    <div
      v-if="show"
      class="casecading-selector-container"
    >
      <div class="casecading-selector-content">
        <slot />
        <div class="casecading-selector-bg" />
      </div>

      <div class="casecading-selector__action">
        <div
          class="clear btn"
          @click="clear"
        >
          清空
        </div>
        <div
          class="confirm btn"
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
    // 从v-model获取的传入数据
    value: {
      type: Object,
      required: true
    },
    // 最终展示的选择结果
    showValue: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      show: false // 定义显示隐藏
    };
  },
  mounted() {
    this.$on('changeSelected', this.handleChangeSelected);
    this.initialValue = this.$helper.deepClone(this.value);
  },
  methods: {
    clear() {
      this.show = false;
      this.$emit("input", this.$helper.deepClone(this.initialValue));
    },
    confirm() {
      this.show = false;
    },
    showAddress() {
      this.show = true;
    },
    handleChangeSelected(type, value) {
      this.value[type] = value;
      this.updateSubKey(value);
    },
    // 递归更新子节点
    updateSubKey(value) {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          const element = value[key];
          if (Array.isArray(element)) {
            const subKey = key.split('Array')[0];
            this.value[subKey] = element[0];
            this.updateSubKey(element[0]);
          }
        }
      }
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
  .casecading-selector__action {
    display: flex;
    align-items: center;
    height: 40px;
    justify-content: flex-end;
    padding: 0 30px;
    border-top: 1px solid grey;
    .btn {
      margin: 5px 10px;
      padding: 0 20px;
    }
    .clear {
      color: grey;
    }
    .confirm {
      background-color: $primary-color;
      color: white;
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
}
</style>
