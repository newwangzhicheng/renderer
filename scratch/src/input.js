import { h } from 'vue';
const vnode = h(
  'div', 
  {
    title: 'this'
  },
  'hello'
);
console.log('vnode :>> ', vnode);