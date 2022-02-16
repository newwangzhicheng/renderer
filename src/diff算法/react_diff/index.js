import { render } from '../../渲染器之挂载/render';
import { h } from '../../辅助创建VNode的h函数/h';

const prevVNode = h('div', null,
    [
        h('div', { key: 1 }),
        h('div', { key: 2 }),
        h('div', { key: 3 })
    ]
)