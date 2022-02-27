import { render } from '../../渲染器之挂载/render';
import { h } from '../../辅助创建VNode的h函数/h';

const container = document.querySelector('#app');

const prevVNode = h('div', null,
    [
        h('div', { key: 1 }, 1),
        h('div', { key: 2 }, 2),
        h('div', { key: 3 }, 3)
    ]
);
const nextVNode = h('div', null,
    [
        h('div', { key: 3 }, 3),
        h('div', { key: 1 }, 1)
    ]
);
render(prevVNode, container);
setTimeout(() => {
    render(nextVNode, container);
}, 3000);