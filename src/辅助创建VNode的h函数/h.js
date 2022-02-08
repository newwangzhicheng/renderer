/** 
 * 通过h函数快速创建VNode对象
 * h函数主要是自动确认flags和childrenFlags
 */
import VNodeFlags from '../先设计VNode吧/VNode种类/VNodeFlags';
import ChildrenFlags from '../先设计VNode吧/VNode种类/ChildrenFlags';

const Fragment = Symbol('fragment');
const Portal = Symbol('portal');

function h(tag, data = null, children = null) {
    /** 确认flags */
    let flags = null;
    if (typeof tag === 'string') {
        flags = tag === 'svg'
            ? VNodeFlags.ELEMENT_SVG
            : VNodeFlags.ELEMENT_HTML;
    } else if (tag === Fragment) {
        flags = VNodeFlags.FRAGMENT;
    } else if (tag === Portal) {
        flags = VNodeFlags.PORTAL;
        /** tag属性存储portal挂载的目标 */
        tag = data && data.target;
    } else {
        /** 默认为组件 */
        if (typeof tag !== null && typeof tag === 'object') {
            /** vue2 判断是不是对象 */
            /** 通过functional属性判断是函数组件还是有状态组件 */
            flags = tag.functional
                ? VNodeFlags.COMPONENT_FUNCTIONAL
                : VNodeFlags.COMPONENT_STATEFUL_NORMAL;
        } else if (typeof tag === 'function') {
            /** vue3组件继承自基类 */
            flags = tag.prototype && tag.prototype.render
                ? VNodeFlags.COMPONENT_STATEFUL_NORMAL
                : VNodeFlags.COMPONENT_FUNCTIONAL;
        }
    }

    /** 确定childrenFlags类型, 仅限于非组件类型 */
    let childrenFlags = null;
    if (Array.isArray(children)) {
        if (children.length === 0) {
            childrenFlags = ChildrenFlags.NO_CHILDREN;
        } else if (children.length === 1) {
            childrenFlags = ChildrenFlags.SINGLE_VNODE;
        } else {
            childrenFlags = ChildrenFlags.KEYED_VNODES;
            children = normalizeVNodes(children);
        }
    } else if (children === null) {
        childrenFlags = ChildrenFlags.NO_CHILDREN;
    } else if (children._isVNode) {
        childrenFlags = ChildrenFlags.SINGLE_VNODE;
    } else {
        /** 默认当作文本处理，即单个节点 */
        childrenFlags = ChildrenFlags.SINGLE_VNODE;
        children = createTextVNode(children + '');
    }

    return {
        _isVNode: true,
        tag,
        data,
        children,
        flags,
        childrenFlags,
        el: null
    };
}

/**
 * 创建有Key的节点
 * @param {VNode[]} children 
 */
function normalizeVNodes(children) {
    const newChildren = [];
    for (const i in children) {
        if (children[i].key == null) {
            children[i].key = '|' + i;
        }
        newChildren.push(children[i]);
    }
    return newChildren;
}

/**
 * 创建文本节点
 * @param {string} children 
 */
function createTextVNode(text) {
    return {
        _isVNode: true,
        flags: VNodeFlags.TEXT,
        tag: null,
        data: null,
        children: text,
        childrenFlags: ChildrenFlags.NO_CHILDREN,
        el: null
    };
}

export { Fragment, Portal, h };