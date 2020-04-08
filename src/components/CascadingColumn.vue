<template>
  <div
    class="cascading-selector-column"
    :style="{height: parentHeight+'px'}"
  >
    <div
      class="outer-cascading-list"
      :class="isMobile ? 'mobile' : ''"
    >
      <ul
        ref="column"
        class="inner-cascading-list"
        :style="style"
        @touchstart="handleColumnTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
        @scroll="debouncedHandleColumnScroll"
        @transitionend="handleColumnTransitionEnd"
      >
        <!-- 使用空的option来保证可选项的位置 -->
        <li class="cascading-selector-option" />
        <li class="cascading-selector-option title">
          {{ prop | translateToChinese }}
        </li>
        <slot />
        <li class="cascading-selector-option" />
        <li class="cascading-selector-option" />
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "CascadingColumn",
  filters: {
    translateToChinese(prop) {
      const E2CMap = {
        province: "省",
        city: "市",
        country: "区/县"
      };
      return E2CMap[prop];
    }
  },
  // 接收prop数据，表示需要操作父组件中value对象上的某个指定数据
  props: {
    prop: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      style: {
        transform: "translate3d(0px, 60px, 0px)",
        transition: "transform .3s"
      },
      activeIndex: 0, // 当前激活的索引
      startY: 0, // 开始距离
      endY: 0, // 结束距离
      prevY: 0, // 上一次移动的距离
      direction: 0, // 滑动方向
      maxY: 0, // 滑动最大距离
      minY: 0, // 滑动最小距离
      optionHeight: 0, // 每一个选项的高度
      parentHeight: 0, // 父容器的高度
      optionLength: 0, // 选项的长度
      preventFormat: false, // 阻止格式化距离
      isMobile: false, // 是否移动端
      debouncedHandleColumnScroll: () => {},
      old: 0
    };
  },
  computed: {
    // 得到父组件中，当前级联选择器所绑定的那一条数据
    propValue() {
      return this.$parent.value[this.prop];
    }
  },
  watch: {
    // 侦听activeIndex的变化
    activeIndex(newValue) {
      // 当activeIndex发生变化，并且可以通过这个新的索引找到对应子组件时
      if (this.$children[newValue]) {
        this.resetActiveFlag(this.$children[newValue].value);
        this.$parent.$emit( "changeSelected", this.prop, this.$children[newValue].value);
      } else {
        // 重置(当清空按钮点击时，activeIndex变成-1)
        this.resetActiveFlag();
      }
    },
    // 侦听当前级联选择器的数据
    propValue(newValue) {
      // 当数据发生改变的时候，向外发布change事件，并将新的值发布在外
      this.$emit("change", newValue);
      this.formatAddress();
    }
  },
  mounted() {

    this.$on('handleOptionClick', (value) => {
      this.resetActiveFlag(value);
      this.$parent.$emit("changeSelected", this.prop, value);
    });

    this.formatData();
    this.formatAddress();

    // 屏幕大小发生改变的时候再次重置选择器
    window.addEventListener("resize", () => {
      this.formatData();
      this.formatAddress();
    });

    // 滚动防抖
    this.debouncedHandleColumnScroll = this.$helper.throttle(this.handleColumnScroll);

    this.isMobile = window.__INITIAL_DATA__.isMobile;
  },
  updated() {
    this.formatData();
    this.formatAddress();
  },
  methods: {
    // 重置isActive的标识位
    resetActiveFlag(activeValue) {
      this.$children.forEach(child => child.value.isActive = false);
      if (activeValue) {
        activeValue.isActive = true;
      }
    },
    // 重置数据的方法
    formatData() {
      // 保存当前选项的长度
      this.optionLength = this.$children.length;
      // 保存当前option的高度
      this.optionHeight = this.$refs["column"].children[0].offsetHeight;
      // 为最外层的父元素设置高度，高度为option的5倍，即一次显示5个option
      this.parentHeight = this.optionHeight * 5;
      // 保存滑动的最大高度
      this.maxY = -this.optionHeight * (this.optionLength - 1);
    },
    // 点击事件发生时, 通过值映射到对应的activeIndex, 重置级联选择器位置
    formatAddress() {
      // 保存当前组件的子组件
      let children = this.$children;
      // 查询到当前组件中与外层传入的数据对应的子组件的索引值
      let index = children.findIndex(
        item => item.value.id === this.$parent.value[this.prop].id
      );
      // 将索引值赋予activeIndex，如果能查找到对应的，说明外部传值了，
      // 就自动滑动到当前索引的位置，否则就显示请选择
      this.activeIndex = index > -1 ? index : -1;
      !this.preventFormat && this.move(- this.activeIndex * this.optionHeight);
    },
    // 通过索引值与当前option的高度计算距离，并执行动画
    move(distance) {
      if (this.isMobile) {
        this.style.transform = `translate3d(0px, ${distance}px, 0px)`;
        return;
      }
      this.$helper.scrollAnimation(this.$refs['column'], this.$refs['column'].scrollTop, this.optionHeight * (this.activeIndex + 1));
    },
    // 触碰开始
    handleColumnTouchStart(e) {
      // 保存触碰开始的位置
      this.startY = e.touches[0].pageY;
      // 清除过渡动画
      this.style.transition = "none";
    },
    // 触碰移动
    handleTouchMove(e) {
      this.preventFormat = true;
      // 保存当前移动的位置
      let moveY = e.changedTouches[0].pageY;
      // 保存当前移动的方向，往下拉的话，moveY - this.startY为正，往上拉的话为负
      this.direction = moveY - this.startY;
      this.move(this.prevY + this.direction);
    },
    // 触碰结束
    handleTouchEnd(e) {
      this.preventFormat = false;
      // 设置过渡动画
      this.style.transition = "transform .4s";
      // 保存结束位置
      this.endY = e.changedTouches[0].pageY;
      // 保存上一次移动的距离
      this.prevY = this.style.transform.split(",")[1].slice(0, -2) * 1;
      // 计算当前手指从触碰开始到结束移动的距离
      const distance = Math.abs(this.endY - this.startY);

      this.activeIndex = this.getActiveIndexFromDistance(e.path[0].offsetTop, distance);

      this.move(- this.activeIndex * this.optionHeight);
    },
    // 过渡结束
    handleColumnTransitionEnd() {
      // 保存上一次移动的距离
      this.prevY = -this.activeIndex * this.optionHeight;
    },
    handleColumnScroll(e) {

      this.activeIndex = this.getActiveIndexFromDistance(e.target.offsetTop, e.target.scrollTop);
      this.move(- this.activeIndex * this.optionHeight);
    },
    getActiveIndexFromDistance(currentTop, distance) {

      let activeIndex = 0;

      // 移动的拖动和pc端的滚动的算法略有不同
      if (this.isMobile) {
        // 根据方向不同来计算应该移动到对应的索引值上
        // 大于0 为向下拉
        if (this.direction > 0) {
          // 通过距离来计算最新的坐标索引
          activeIndex = this.activeIndex - Math.round(distance / this.optionHeight);
          //  小于 0 为向上拉
        } else if (this.direction < 0) {
          // 通过距离来计算最新的坐标索引
          activeIndex = this.activeIndex + Math.round(distance / this.optionHeight);
        }
        // 判断当前移动距离特别小，判定为触碰事件，而不是滑动
        if (distance <= 1) {
          // e.path 保存了触发当前事件的源数组、0号元素代表当前点击的option
          // 通过当前点击的元素的offsetTop计算当前元素正确的索引值
          activeIndex = Math.round((currentTop - this.optionHeight * 2) / this.optionHeight);
        }
      } else {
        activeIndex = Math.round(distance / this.optionHeight) - 1;
      }

      // 对activeIndex值进行进一步处理，保证其不会超出选项范围
      activeIndex =
        activeIndex < 0
          ? 0
          : activeIndex > this.optionLength - 1
          ? this.optionLength - 1
          : activeIndex;

      return activeIndex;
    }
  }
};
</script>

<style lang="scss" scoped>
.casecading-selector-column {
  flex: 1;
  overflow: hidden;
  & + .casecading-selector-column {
    border-left: 1px solid #ddd;
  }
}

.cascading-selector-option {
  line-height: 60px;
  height: 60px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  &.title {
    font-size: 14px;
    color: gray;
  }
}

.inner-cascading-list {
  padding: 0;
  overflow-x: hidden;
	overflow-y: scroll;
  position: absolute;
  right: -20px;
  left: 0;
  top: 0;
  bottom: 0;
}

.outer-cascading-list {
  height: 240px;
  width: 100px;
  overflow: hidden;
  position: relative;
  &.mobile {
    overflow: visible;
    .inner-cascading-list {
      position: initial;
    }
  }
}
</style>
