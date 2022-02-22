import ChildrenFlags from "../../先设计VNode吧/VNode种类/ChildrenFlags";
import VNodeFlags from "../../先设计VNode吧/VNode种类/VNodeFlags";
import { domPropsER, mount, normailzeClass } from "../../渲染器之挂载/mount";

/**
 * 本算法采用react diff模式
 */
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
        patchText(prevVNode, nextVNode);
    } else if (nextFlags & VNodeFlags.FRAGMENT) {
        patchFragment(prevVNode, nextVNode, container);
    } else if (nextFlags & VNodeFlags.PORTAL) {
        patchPortal(prevVNode, nextVNode);
    }
}

function replaceVNode(prevVNode, nextVNode, container) {
    container.removeChild(prevVNode.el);
    if (prevVNode.flags & VNodeFlags.COMPONENT_STATEFUL) {
        /** 如果替换的有状态组件，调用unmounted */
        const instance = prevVNode.children;
        instance.unmounted && instance.unmounted();
    }
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
        if (nextData) {
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

        /** 更新子节点 */
        patchChildren(
            prevVNode.childrenFlags,
            nextVNode.childrenFlags,
            prevVNode.children,
            nextVNode.children,
            el
        );
    }
}

/**
 * patch 组件
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 * @param {HTMLElement} container 
 */
function patchComponent(prevVNode, nextVNode, container) {
    if (prevVNode.tag !== nextVNode.tag) {
        replaceVNode(prevVNode, nextVNode, container);
    } else if (nextVNode.flags && VNodeFlags.COMPONENT_STATEFUL) {
        /** 有状态组件更新，组件的实例设计保存在children中 */
        const instance = (nextVNode.children = prevVNode.children);
        /** 更新props */
        instance.$props = nextVNode.data;
        instance._update();
    } else {
        /** 函数式组件更新 */
        const handle = (nextVNode.handle = prevVNode.handle);
        handle.prev = prevVNode;
        handle.next = nextVNode;
        handle.container = container;
        handle.update();
    }
}

/**
 * 更新文本
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 * @param {HTMLElement} contianer 
 */
function patchText(prevVNode, nextVNode) {
    const el = (nextVNode.el = prevVNode.el);
    /** 只有文本不一致的时候才更新 */
    if (prevVNode.children !== nextVNode.children) {
        el.nodeValue = nextVNode.children;
    }
}

/**
 * 更新Fragment
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 * @param {HTMLElement} container 
 */
function patchFragment(prevVNode, nextVNode, container) {
    /** 更新子节点 */
    patchChildren(
        prevVNode.childrenFlags,
        nextVNode.childrenFlags,
        prevVNode.children,
        nextVNode.children,
        container
    );
    /** 更新VNode */
    switch (nextVNode.childrenFlags) {
        case ChildrenFlags.NO_CHILDREN:
            const placeholder = document.createTextNode('');
            container.appendChild(placeholder);
            nextVNode.el = placeholder;
            break;
        case ChildrenFlags.SINGLE_VNODE:
            nextVNode.el = nextVNode.children.el;
            break;
        default:
            nextVNode.el = nextVNode.children[0].el;
            break;
    }
}

/**
 * patch portal
 * @param {VNode} prevVNode 
 * @param {VNode} nextVNode 
 */
function patchPortal(prevVNode, nextVNode) {
    /** 更新子节点 */
    patchChildren(
        prevVNode.childrenFlags,
        nextVNode.childrenFlags,
        prevVNode.children,
        nextVNode.children,
        prevVNode.tag
    );
    nextVNode.el = prevVNode.el;

    /** 如果portal的tag不同，则搬运 */
    if (prevVNode.tag !== nextVNode.tag) {
        const container = typeof nextVNode.tag === 'string'
            ? document.querySelector(nextVNode.tag)
            : nextVNode.tag;
        switch (nextVNode.childrenFlags) {
            case ChildrenFlags.NO_CHILDREN:
                break;
            case ChildrenFlags.SINGLE_VNODE:
                container.appendChild(nextVNode.children.el);
                break;
            default:
                for (const child of nextVNode.children) {
                    container.appendChild(child.el);
                }
                break;
        }
    }
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
                el.style[i] = nextValue[i];
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
function patchChildren(prevChildrenFlags, nextChildrenFlags, prevChildren, nextChildren, container) {
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
                    container.removeChild(prevChildren.el);
                    break;
                /** 有单个节点 */
                case ChildrenFlags.SINGLE_VNODE:
                    /** patch新旧节点 */
                    patch(prevChildren, nextChildren, container);
                    break;
                /** 有多个节点 */
                default:
                    /** 移除旧的VNode, 循环遍历挂载 */
                    container.removeChild(prevChildren.el);
                    for (const child of nextChildren) {
                        mount(child, container);
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
                    /**
                     * 双端比较
                     * 
                     */
                    let oldStartIdx = 0;
                    let oldEndIdx = prevChildren.length - 1;
                    let newStartIdx = 0;
                    let newEndIdx = nextChildren.length - 1;

                    let oldStartVNode = prevChildren[oldStartIdx];
                    let oldEndVNode = prevChildren[oldEndIdx];
                    let newStartVNode = nextChildren[newStartIdx];
                    let newEndVNode = nextChildren[newEndIdx];

                    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
                        if (oldStartVNode.key === newStartVNode.key) {
                            /**
                             * 1. 旧的第一个元素和新的第一个元素key相同
                             */
                            patch(oldStartVNode, newStartVNode, container);
                            oldStartVNode = prevChildren[++oldStartIdx];
                            newStartVNode = nextChildren[++newStartIdx];
                        } else if (oldEndVNode.key === newEndVNode.key) {
                            /**
                             * 2. 旧的最后一个元素和新的最后一个元素key相同
                             */
                            patch(oldEndVNode, newEndVNode, container);
                            oldEndVNode = prevChildren[--oldEndIdx];
                            newEndVNode = nextChildren[--newEndIdx];
                        } else if (oldStartVNode.key === newEndVNode.key) {
                            /**
                             * 3. 旧的第一个元素和新的最后一个元素key相同
                             */
                            patch(oldStartVNode, newEndVNode, container);
                            container.insertBefore(oldStartVNode.el, oldEndVNode.el.nextSibling);
                            oldStartVNode = prevChildren[++oldStartIdx];
                            newEndVNode = nextChildren[--newEndIdx];
                        } else if (oldEndVNode.key === newStartVNode.key) {
                            /**
                             * 4. 旧的最后一个元素和新的第一个元素key相同
                             */
                            patch(oldEndVNode, newStartVNode, container);
                            container.insertBefore(oldEndVNode.el, oldStartVNode.el);
                            oldEndVNode = prevChildren[--oldEndIdx];
                            newStartVNode = nextChildren[++newStartIdx];
                        } else {

                        }
                    }
                    break;
            }
            break;
    }
}
