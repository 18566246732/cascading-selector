<template>
  <div
    class="cascading-selector-wrapper"
    :style="{height: parentHeight+'px'}"
  >
    <ul
      ref="wrapper"
      class="cascading-list"
      :style="style"
      @touchstart="touchStart($event)"
      @touchmove="touchMove($event)"
      @touchend="touchEnd($event)"
      @transitionend="transitionEnd($event)"
    >
      <!-- 使用空的option来保证可选项的位置 -->
      <li class="cascading-selector-option" />
      <li class="cascading-selector-option">
        {{ prop }}
      </li>
      <slot />
      <li class="cascading-selector-option" />
      <li class="cascading-selector-option" />
    </ul>
  </div>
</template>

<script>
export default {
  name: "CascadingWrapper",
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
        transform: "translate3d(0px,0px,0px)",
        transition: "transform .3s"
      },
      activeIndex: 0, // 当前激活的索引
      startY: 0, // 开始距离
      startTime: 0, // 开始时间
      endY: 0, // 结束距离
      endTime: 0, // 结束时间
      prevY: 0, // 上一次移动的距离
      direction: 0, // 滑动方向
      maxY: 0, // 滑动最大距离
      minY: 0, // 滑动最小距离
      optionHeight: 0, // 每一个选项的高度
      parentHeight: 0, // 父容器的高度
      optionLength: 0, // 选项的长度
      preventFormat: false // 阻止格式化距离
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
        this.$parent.$emit( "changeSelected", this.prop, this.$children[newValue].value);
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
      this.$parent.$emit("changeSelected", this.prop, value);
    });


    this.formatData();
    this.formatAddress();

    // 屏幕大小发生改变的时候再次重置选择器
    window.addEventListener("resize", () => {
      this.formatData();
      this.formatAddress();
    });
  },
  updated() {
    this.formatData();
    this.formatAddress();
  },
  methods: {
    // 重置数据的方法
    formatData() {
      // 保存当前的子组件，使用this.$children获取到的是当前组件所有的子组件（子Vue实例）
      let children = this.$children;

      // 保存当前选项的长度
      this.optionLength = children.length;
      // 保存当前option的高度
      this.optionHeight = this.$refs["wrapper"].children[0].offsetHeight;
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
      !this.preventFormat && this.move(-this.activeIndex);
    },
    // 通过索引值与当前option的高度计算距离，并执行动画
    move(activeIndex) {
      this.style.transform = `translate3d(0px, ${activeIndex *
        this.optionHeight}px, 0px)`;
    },
    // 触碰开始
    touchStart(e) {
      // 保存触碰开始的位置
      this.startY = e.touches[0].pageY;
      // 保存触碰开始的时间
      this.startTime = e.timeStamp;
      // 清除过渡动画
      this.style.transition = "none";
    },
    // 触碰移动
    touchMove(e) {
      this.preventFormat = true;

      // 保存当前移动的位置
      let moveY = e.changedTouches[0].pageY;

      // 保存当前移动的方向，往下拉的话，moveY - this.startY为正，往上拉的话为负
      this.direction = moveY - this.startY;
      // 设置拖拽移动
      this.style.transform = `translate3d(0px,${this.prevY +
        this.direction}px,0px)`;
    },
    // 触碰结束
    touchEnd(e) {
      this.preventFormat = false;
      // 设置过渡动画
      this.style.transition = "transform .4s";
      // 保存结束位置
      this.endY = e.changedTouches[0].pageY;
      // 保存结束时间
      this.endTime = e.timeStamp;
      // 保存上一次移动的距离
      this.prevY = this.style.transform.split(",")[1].slice(0, -2) * 1;
      // 计算当前移动到的位置索引
      let activeIndex = -Math.round(this.prevY / this.optionHeight);
      // 计算当前手指从触碰开始到结束移动的距离
      let distance = Math.abs(this.endY - this.startY);
      // 计算当前手指从触碰开始到结束的时间差
      let interval = this.endTime - this.startTime;
      // 根据方向不同来计算应该移动到对应的索引值上
      // 大于0 为向下拉
      if (this.direction > 0) {
        // 通过距离来计算最新的坐标索引
        activeIndex =
          this.activeIndex - Math.round(distance / this.optionHeight);
        //  小于 0 为向上拉
      } else if (this.direction < 0) {
        // 通过距离来计算最新的坐标索引
        activeIndex =
          this.activeIndex + Math.round(distance / this.optionHeight);
      }
      // 判断当前移动距离特别小，判定为触碰事件，而不是滑动
      if (distance <= 1) {
        // e.path 保存了触发当前事件的源数组、0号元素代表当前点击的option
        // 通过当前点击的元素的offsetTop计算当前元素正确的索引值
        activeIndex = Math.round(
          (e.path[0].offsetTop - this.optionHeight * 2) / this.optionHeight
        );
      }

      // 对activeIndex值进行进一步处理，保证其不会超出选项范围
      activeIndex =
        activeIndex < 0
          ? 0
          : activeIndex > this.optionLength - 1
          ? this.optionLength - 1
          : activeIndex;

      // 执行判断并赋值索引
      this.activeIndex = activeIndex;
      this.move(-this.activeIndex);
    },
    // 过渡结束
    transitionEnd() {
      // 保存上一次移动的距离
      this.prevY = -this.activeIndex * this.optionHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
.casecading-selector-wrapper {
  flex: 1;
  overflow: hidden;
  & + .casecading-selector-wrapper {
    border-left: 1px solid #ddd;
  }
}

.cascading-selector-option {
  line-height: 60px;
  height: 60px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cascading-list {
  padding: 0;
}
</style>
