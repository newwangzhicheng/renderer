import VNodeFlags from "../先设计VNode吧/VNode种类/VNodeFlags";
import { mount } from "./mount";

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