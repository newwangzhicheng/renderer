import { MyComponent } from './render';
import { init } from 'snabbdom';

const patch = init([]);
const prev = MyComponent({
  title: '这是旧VNode'
});
const next = MyComponent({
  title: '这是新VNode'
});

patch(document.querySelector('#app'), prev);
setTimeout(() => {
  patch(prev, next);
}, 3000);