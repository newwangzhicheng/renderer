export default function render(vnode, container) {
  if (typeof vnode.tag ==='string') {
    mountElement(vnode, container);
  } else {
    mountComponent(vnode, container);
  }
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag);
  container.appendChild(el);
}

function mountComponent(vnode, container) {
  const instance = new vnode.tag();
  instance.$vnode = instance.render();
  mountElement(instance.$vnode, container);
}