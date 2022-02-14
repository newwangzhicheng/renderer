import VNodeFlags from '../先设计VNode吧/VNode种类/VNodeFlags';
import ChildrenFlags from '../先设计VNode吧/VNode种类/ChildrenFlags';

export function mount(vnode, container, isSVG) {
    const { flags } = vnode;
    if (flags & VNodeFlags.ELEMENT) {
        mountElement(vnode, container, isSVG);
    } else if (flags & VNodeFlags.COMPONENT) {
        mountComponent(vnode, container, isSVG);
    } else if (flags & VNodeFlags.TEXT) {
        mountText(vnode, container);
    } else if (flags & VNodeFlags.FRAGMENT) {
        mountFragment(vnode, container, isSVG);
    } else if (flags & VNodeFlags.PORTAL) {
        mountPortal(vnode, container, isSVG);
    }
}

export const domPropsER = /\[A-Z]|^(?:value|checked|selected|muted)$/;
function mountElement(vnode, container, isSVG) {
    /** 创建Element*/
    isSVG = isSVG || (vnode.flags & VNodeFlags.isSVG);
    const el = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);
    vnode.el = el;

    /** 处理data */
    const { data } = vnode;
    if (data) {
        for (let prop in data) {
            switch (prop) {
                case 'style':
                    for (const k in data.style) {
                        el.style[k] = data.style[k];
                    }
                    break;
                case 'class':
                    const className = normailzeClass(data.class);
                    // el.setAttribute('className', className);
                    el.className = className;
                    break;
                default:
                    if (prop.startsWith('on')) {
                        /** 处理事件 */
                        el.addEventListener(prop.slice(2), data[prop]);
                    } else if (domPropsER.test(prop)) {
                        /** 当作dom property处理 */
                        el[prop] = data[prop];
                    } else {
                        /** 当作attribute处理 */
                        el.setAttribute(prop, data[prop]);
                    }
                    break;
            }
        }
    }
    container.appendChild(el);

    /** 处理子节点 */
    const { childrenFlags } = vnode;
    const { children } = vnode;
    if (childrenFlags !== ChildrenFlags.NO_CHILDREN) {
        /** 单个子节点直接挂载 */
        if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
            mount(children, el, isSVG);
        } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
            for (const child of children) {
                mount(child, vnode, isSVG);
            }
        }
    }
}

function mountText(vnode, container) {
    /** 文本内容在children上 */
    const el = document.createTextNode(vnode.children);
    vnode.el = el;
    container.appendChild(el);
}

function mountFragment(vnode, container, isSVG) {
    /** 处理children */
    const { childrenFlags, children } = vnode;
    if (childrenFlags & ChildrenFlags.NO_CHILDREN) {
        /** 没有子节点. 使用空文本节点作为el的引用 */
        const placeholder = document.createTextNode('');
        mountText(placeholder, container);
        vnode.el = placeholder.el;
    } else if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
        /** 单个子节点，引用为子节点 */
        mount(children, container, isSVG);
        vnode.el = children.el;
    } else if (childrenFlags & ChildrenFlags.KEYED_VNODES) {
        /** 多个子节点，引用为第一个子节点 */
        for (const child of children) {
            mount(child, container, isSVG);
        }
        vnode.el = children[0].el;
    }
}

function mountPortal(vnode, container, isSVG) {
    const { tag, childrenFlags, children } = vnode;
    const target = typeof tag === 'string'
        ? document.querySelector(tag) : tag;
    if (childrenFlags & ChildrenFlags.SINGLE_VNODE) {
        mount(children, target, isSVG);
    } else if (childrenFlags & ChildrenFlags.MULTIPLE_VNODES) {
        for (const child of children) {
            mount(child, target, isSVG);
        }
    }

    /** 占位节点 */
    const placeholder = document.createTextNode('');
    container.appendChild(placeholder);
    vnode.el = placeholder.el;
}


function mountComponent(vnode, container, isSVG) {
    const { flags } = vnode;
    if (flags & VNodeFlags.COMPONENT_STATEFUL) {
        mountStatefulComponent(vnode, container, isSVG);
    } else if (flags & VNodeFlags.COMPONENT_FUNCTIONAL) {
        mountFunctionalComponent(vnode, container, isSVG);
    }
}

function mountStatefulComponent(vnode, container, isSVG) {
    const instance = new vnode.tag();
    /** 渲染 */
    instance.$vnode = instance.render();
    mount(instance.$vnode, container, isSVG);
    instance.$el = vnode.el = instance.$vnode.el;
}

function mountFunctionalComponent(vnode, container, isSVG) {
    const $vnode = vnode.tag();
    mount($vnode, container, isSVG);
    vnode.el = $vnode.el;
}

export function normailzeClass(className) {
    const newClassName = [];
    if (Array.isArray(className)) {
        for (const item of className) {
            if (typeof item === 'string') {
                newClassName.push(item);
            } else if (Object.prototype.toString.call(item) === '[object Object]') {
                /** 
                 * 对象形式，形如
                 * {
                 *      class_name_1: true,
                 *      class_name_2: false
                 * }
                 */
                for (const i in item) {
                    if (item[i]) {
                        newClassName.push(i);
                    }
                }
            } else if (Array.isArray(item)) {
                /**
                 * 数组形式，形如
                 * [
                 *      class_name_1,
                 *      class_name_2
                 * ]
                 */
                for (const i of item) {
                    newClassName.push(i);
                }
            }
        }
        return newClassName.join(' ');
    } else if (typeof className === 'string') {
        return className;
    }
    return '';
}