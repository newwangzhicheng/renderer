// 有状态的组件
class MyComponent {
    render() {
        return {
            tag: 'div'
        };
    }
}

// 渲染函数
function render(vnode, container) {
    if (typeof vnode === 'string') {
        mountElement(vnode, container);
    } else {
        mountComponent(vnode, container);
    }
}

// 挂载元素
function mountElement(vnode, container) {
    const el = document.createElement(vnode.tag);
    container.appendChild(el);
}

// 挂载组件
function mountComponent(vnode, container) {
    const instance = new vnode.tag();
    instance.$node = instance.render();
    mountElement(instance.$node, container);
}


render({ tag: MyComponent }, document.querySelector('#app'));