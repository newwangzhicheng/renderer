import VNodeFlags from '../先设计VNode吧/VNode种类/VNodeFlags';

export function mount(vnode, container) {
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

const domPropsER = /\[A-Z]|^(?:value|checked|selected|muted)$/;
function mountElement(vnode, container, isSVG) {
    /** 创建Element并处理data */
    isSVG = isSVG || (vnode.flags & VNodeFlags.isSVG);
    const el = isSVG ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);
    vnode.el = el;

    const { data } = vnode;
    if (data) {
        for (let prop in data.style) {
            switch (prop) {
                case 'style':
                    el.style[prop] = data.style[prop];
                    break;
                case 'class':
                    const className = normailzeClass(data.class);
                    el.className = className;
                default:
                    if (prop.startsWith('on')) {
                        /** 处理事件 */
                        el.addEventListener
                    } else if (domPropsER.test(prop)) {
                        /** 当作dom property处理 */
                        el[prop] = data[prop];
                    } else {
                        /** 当作attribute处理 */
                        el.setArrtibute(prop, data[prop]);
                    }
                    break;
            }
        }
    }
    container.appendChild(el);

}

function mountComponent(vnode, container, isSVG) {

}

function mountText(vnode, container) {

}

function mountFragment(vnode, container, isSVG) {

}

function mountPortal(vnode, container, isSVG) {

}

function normailzeClass(class) {
    return '';
}