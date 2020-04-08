export default {
  deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  },
  /** 用于过长时滚动滚动条到指定条目的方法
    * @param { HTMLElement } 将要滚动的节点
    * @param { Number } 要滚动到的指定位置
    * @param { Number } 每次垂直滚动的幅度
    */
  scrollTo(dom, x, y) {
    if (dom) {
      if (dom.scrollTo) {
        dom.scrollTo(x, y);
      } else if (dom.scrollTop) {
        dom.scrollTop = y;
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
  },
  /**
   * 动画垂直滚动到页面指定位置
   *
   * @param { HTMLElement } dom 滚动对象
   * @param { Number } currentY 当前位置
   * @param { Number } targetY 目标位置
   */
  scrollAnimation(dom, currentY, targetY) {
    // 计算需要移动的距离
    let needScrollTop = targetY - currentY;
    let _currentY = currentY;
    setTimeout(() => {
      // 一次调用滑动帧数，每次调用会不一样
      const dist = Math.ceil(needScrollTop / 10);
      _currentY += dist;
      this.scrollTo(dom, _currentY, currentY);
      // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
      if (needScrollTop > 10 || needScrollTop < -10) {
        this.scrollAnimation(dom, _currentY, targetY);
      } else {
        this.scrollTo(dom, _currentY, targetY);
      }
    }, 5);
  }
};
