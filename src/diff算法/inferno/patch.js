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
            /** inforno */
            let j = 0;
            let prevEnd = prevChildren.length - 1;
            let nextEnd = nextChildren.length - 1;
            let prevVNode = prevChildren[j];
            let nextVNode = nextChildren[j];
            outer: {
                while (prevVNode.key === nextVNode.key) {
                    /** 前缀遍历 */
                    patch(prevVNode, nextVNode, container);
                    j++;
                    if (j > prevEnd || j > nextEnd) {
                        break outer;
                    }
                    prevVNode = prevChildren[j];
                    nextVNode = nextChildren[j];
                }

                prevVNode = prevChildren[prevEnd];
                nextVNode = nextChildren[nextEnd];

                while (prevVNode.key === nextVNode.key) {
                    /** 后缀遍历 */
                    patch(prevVNode, nextVNode, container);
                    prevEnd--;
                    nextEnd--;
                    if (j > prevEnd || j > nextEnd) {
                        break outer;
                    }
                    prevVNode = prevChildren[prevEnd];
                    nextVNode = nextChildren[nextEnd];
                }
            }


            if (j > prevEnd && j <= nextEnd) {
                /** 添加多余的节点 */
                const nextPos = nextEnd + 1;
                const refEl = nextPos < nextChildren.length
                    ? nextChildren[nextPos].el
                    : null;
                while (j <= nextEnd) {
                    mount(nextChildren[j++], container, false, refEl);
                }
            } else if (j > nextEnd) {
                /** 移除多余的节点 */
                while (j <= prevEnd) {
                    container.removeChild(prevChildren[j++].el);
                }
            } else {
                /** 构造source数组，source节点记录nextChildren节点在prevChildren节点中的位置 */
                const nextLeft = nextEnd - j + 1;
                const source = [];
                for (let i = 0; i < nextLeft; i++) {
                    source.push(-1);
                }

                let move = false;
                let pos = 0;
                let patchedCount = 0;
                let prevStart = j;
                let nextStart = j;
                /** 构建索引 */
                const keyIndex = {};
                for (let i = nextStart; i <= nextEnd; i++) {
                    keyIndex[nextChildren[i].key] = i;
                }

                for (let i = prevStart; i <= prevEnd; i++) {
                    const prevVNode = prevChildren[i];
                    if (patchedCount < nextLeft) {
                        const k = keyIndex[prevVNode.key];
                        if (typeof k !== 'undefined') {
                            const nextVNode = nextChildren[k];
                            if (prevVNode.key === nextVNode.key) {
                                patch(prevVNode, nextVNode, container);
                                patchedCount++;
                                source[k - nextStart] = i;
                                /** 判度是否需要移动 */
                                if (k < pos) {
                                    move = true;
                                } else {
                                    pos = k;
                                }
                            }
                        } else {
                            /** 说明旧的节点在新children中已经不存在，可以移除 */
                            container.removeChild(prevVNode.el)
                        }
                    } else {
                        /** 已更新的新的节点数量超过所有新的节点，说明是多余节点，删除 */
                        container.removeChild(prevVNode.el);
                    }
                }

                if (move) {
                    /** 移动DOM */
                    const seq = lis(source);
                    /** l指向最长递增子序列最后一位 */
                    let l = seq.length - 1;
                    /** 从后向前遍历新children中剩余未处理的节点 */
                    for (let i = nextLeft - 1; i >= 0; i--) {
                        if (source[i] === -1) {
                            /** 作为全新节点挂载 */
                            const pos = i + nextStart;
                            const nextVNode = nextChildren[pos];
                            /** 挂载到nextPos的节点的前面 */
                            const nextPos = pos + 1;
                            mount(
                                nextVNode,
                                container,
                                false,
                                nextPos < nextChildren.length
                                    ? nextChildren[nextPos].el
                                    : null
                            );
                        } else if (i !== seq[l]) {
                            /** 需要移动的节点 */
                            const pos = i + nextStart;
                            const nextVNode = nextChildren[pos];
                            /** 挂载到nextPos的节点的前面 */
                            const nextPos = pos + 1;
                            container.insertBefore(
                                nextVNode.el,
                                nextPos < nextChildren.length
                                    ? nextChildren[nextPos].el
                                    : null,
                            );
                        } else {
                            /** 在子序列中，不需要移动的节点 */
                            /** l指向下一个位置 */
                            l--;
                        }
                    }

                }
            }
            break;
    }
}


function lis(arr) {
    const p = arr.slice()
    const result = [0]
    let i
    let j
    let u
    let v
    let c
    const len = arr.length
    for (i = 0; i < len; i++) {
        const arrI = arr[i]
        if (arrI !== 0) {
            j = result[result.length - 1]
            if (arr[j] < arrI) {
                p[i] = j
                result.push(i)
                continue
            }
            u = 0
            v = result.length - 1
            while (u < v) {
                c = ((u + v) / 2) | 0
                if (arr[result[c]] < arrI) {
                    u = c + 1
                } else {
                    v = c
                }
            }
            if (arrI < arr[result[u]]) {
                if (u > 0) {
                    p[i] = result[u - 1]
                }
                result[u] = i
            }
        }
    }
    u = result.length
    v = result[u - 1]
    while (u-- > 0) {
        result[u] = v
        v = p[v]
    }
    return result
}
