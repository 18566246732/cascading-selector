export default {
  deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  },
  /** 用于过长时滚动滚动条到指定条目的方法
    * @param { HTMLElement } 将要滚动的节点
    * @param { Number } 要滚动到的指定位置
    * @param { Number } 每次垂直滚动的幅度
    */
  scrollTo(dom, index, SCROLL_STEP) {
    if (dom, index > 0) {
      if (dom.scrollTo) {
        dom.scrollTo(0, index * SCROLL_STEP);
      } else if (dom.scrollTop) {
        dom.scrollTop = index * SCROLL_STEP;
      }
    }
  },
  /**
   * 截流函数
   *
   * @param {Function} fn
   * @param {Number} interval
   */
  throttle(fn, interval = 100) {
    let canRun = true;
    return function throttledFn(params) {
      if (!canRun) return;
      canRun = false;
      setTimeout(() => {
        fn.apply(this, arguments);
        canRun = true;
      }, interval);
    };
  }
};
