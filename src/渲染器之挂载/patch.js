import ChildrenFlags from "../先设计VNode吧/VNode种类/ChildrenFlags";
import VNodeFlags from "../先设计VNode吧/VNode种类/VNodeFlags";
import { domPropsER, mount, normailzeClass } from "./mount";

export function patch(prevVNode, nextVNode, container) {
    const prevFlags = prevVNode.flags;
    const nextFlags = nextVNode.flags;
    if (prevFlags !== nextFlags) {
        replaceVNode(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.ELEMENT) {
        patchElement(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.COMPONENT) {
        patchComponent(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.TEXT) {
        patchText(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.FRAGMENT) {
        patchFragment(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.PORTAL) {
        patchPortal(prevVNode, nextVNode, container);
    }
}

function replaceVNode(prevVNode, nextVNode, container) {
    container.removeChild(prevVNode.el);
    mount(nextVNode, container);
}

/**
 * 更新策略
 * 不同的标签直接替换
 * 相同的标签更新data属性
 * 最后更新子元素
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 * @param {HTMLElement} container 
 */
function patchElement(prevVNode, nextVNode, container) {
    /** 更新元素属性 */
    if (prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container);
    } else {
        const el = (nextVNode.el = prevVNode.el);
        const prevData = prevVNode.data;
        const nextData = nextVNode.data;
        if (prevData) {
            /** 遍历新元素的data，替换为新的属性 */
            for (const i in nextData) {
                patchData(el, i, prevData[i], nextData[i]);
            }
            /** 遍历旧元素的data，将新元素data不存在的属性删除 */
            for (const i in prevData) {
                if (prevData[i] && !nextData.hasOwnProperty(i)) {
                    patchData(el, i, prevData[i], null);
                }
            }
        }
    }

    /** 更新子节点 */
    patchChildren(
        prevVNode.childrenFlags,
        nextVNode.childrenFlags,
        prevVNode.children,
        nextVNode.children,
        el
    );
}


/**
 * 更新属性
 * @param {HTMLElement} el 
 * @param {string} prop 
 * @param {any} prevValue 
 * @param {any} nextValue 
 */
function patchData(el, prop, prevValue, nextValue) {
    switch (prop) {
        case 'style':
            for (const i in nextValue) {
                el.style[prop] = nextValue[i];
            }
            for (const i in prevValue) {
                if (!nextValue.hasOwnProperty(i)) {
                    el.style[i] = '';
                }
            }
            break;
        case 'class':
            const className = normailzeClass(nextValue);
            el.className = className;
            break;
        default:
            if (prop.startsWith('on')) {
                const eventType = prop.slice(2);
                if (prevValue) {
                    el.removeEventListener(eventType, prevValue);
                }
                if (nextValue) {
                    el.addEventListener(eventType, nextValue);
                }
            } else if (domPropsER.test(prop)) {
                el[prop] = nextValue;
            } else {
                el.setAttribute(prop, nextValue);
            }
            break;
    }
}

/**
 * patch子元素，有3*3共9种可能
 * @param {HTMLElement} container 
 * @param {number} prevChildrenFlags 
 * @param {number} nextChildrenFlags 
 * @param {VNode} prevChildren 
 * @param {VNode} nextChildren 
 */
function patchChildren(container, prevChildrenFlags, nextChildrenFlags, prevChildren, nextChildren) {
    switch (prevChildrenFlags) {
        /** 没有子节点 */
        case ChildrenFlags.NO_CHILDREN:
            switch (nextChildrenFlags) {
                /** 没有子节点 */
                case ChildrenFlags.NO_CHILDREN:
                    /** 什么也不做 */
                    break;
                /** 有单个节点 */
                case ChildrenFlags.SINGLE_VNODE:
                    /** 直接挂载新节点 */
                    mount(nextChildren, container);
                    break;
                /** 有多个节点 */
                default:
                    /** 循环遍历挂载 */
                    for (const child of nextChildren) {
                        mount(child, container);
                    }
                    break;
            }
            break;
        /** 单个子节点 */
        case ChildrenFlags.SINGLE_VNODE:
            switch (nextChildrenFlags) {
                /** 没有子节点 */
                case ChildrenFlags.NO_CHILDREN:
                    /** 移除旧的VNode */
                    container.removeChild(prevVNode.el);
                    break;
                /** 有单个节点 */
                case ChildrenFlags.SINGLE_VNODE:
                    /** patch新旧节点 */
                    patch(prevChildren, nextChildren, container);
                    break;
                /** 有多个节点 */
                default:
                    /** 移除旧的VNode, 循环遍历挂载 */
                    container.removeChild(prevVNode.el);
                    for (const child of nextChildren) {
                        mount(child, el);
                    }
                    break;
            }
            break;
        /** 多个节点 */
        default:
            switch (nextChildrenFlags) {
                /** 没有子节点 */
                case ChildrenFlags.NO_CHILDREN:
                    /** 循环移除旧的VNode */
                    for (const child of prevChildren) {
                        container.removeChild(child.el);
                    }
                    break;
                /** 有单个节点 */
                case ChildrenFlags.SINGLE_VNODE:
                    /** 循环移除旧的VNode，挂载新的VNode */
                    for (const child of prevChildren) {
                        container.removeChild(child.el);
                    }
                    mount(nextChildren, container);
                    break;
                /** 有多个节点 */
                default:
                    /** 循环移除旧的VNode，循环挂载新的VNode */
                    for (const child of prevChildren) {
                        container.removeChild(child.el);
                    }
                    for (const child of nextChildren) {
                        mount(child, container);
                    }
                    break;
            }
            break;
    }
}
