const buckets = new Set();

/** 原始数据 */
const data = { text: 'hello world' };
/** 原始副作用函数 */
function effect() {
  document.body.innerText = obj.text;
}

const obj = new Proxy(data, {
  get(target, key) {
    /** 副作用函数装桶 */
    buckets.add(effect);
    return target[key];
  },
  set(target, key, newVal) {
    target[key] = newVal;
    /** 执行副作用函数 */
    buckets.forEach(fn => fn());
    return true;
  }
});



/** 触发读取 */
effect();
/** 触发设置 */
setTimeout(() => {
  obj.text = 'world 3';
}, 2000);