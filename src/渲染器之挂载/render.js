import { mount } from './mount';
// import { patch } from './patch';

// import { patch } from '../diff算法/react_diff/patch';
import { patch } from '../diff算法/双端比较/patch';

/**
 * 挂载函数
 * 根据容器contaienr的情况是选择mount，patch或remove元素
 * @param {Object} vnode 
 * @param {HTMLElement} container 
 */
export function render(vnode, container) {
    const prevVNode = container.vnode;
    if (prevVNode == null) {
        if (vnode) {
            /** 旧vnode不存在，直接挂载新vnode */
            mount(vnode, container);
            container.vnode = vnode;
        }
    } else {
        if (vnode) {
            /** 旧vnode存在，新vnode存在，patch */
            patch(prevVNode, vnode, container);
            container.vnode = vnode;
        } else {
            /** 旧vnode存在，新vnode不存在，移除旧node即可 */
            container.removeChild(prevVNode.el);
            container.vnode = null;
        }
    }
}