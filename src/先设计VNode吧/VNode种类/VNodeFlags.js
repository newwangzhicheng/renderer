const VNodeFlags = {
    // html标签
    ELEMENT_HTML: 1,
    // svg标签
    ELEMENT_SVG: 1 << 1,

    // 普通的有状态组件
    COMPONENT_STATEFUL_NORMAL: 1 << 2,
    // 需要被keepAlive的有状态组件
    COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE: 1 << 3,
    // 已经被keepAlive的有状态组件
    COMPONENT_STATEFUL_KEPT_ALIVE: 1 << 4,
    // 函数式组件
    COMPONENT_FUNCTIONAL: 1 << 5,

    // text
    TEXT: 1 << 6,
    // fragment
    FRAGMENT: 1 << 7,
    // portal
    PORTAL: 1 << 8
};

// 元素
VNodeFlags.ELEMENT = VNodeFlags.ELEMENT_HTML | VNodeFlags.ELEMENT_SVG;

//  有状态组件
VNodeFlags.COMPONENT_STATEFUL = VNodeFlags.COMPONENT_STATEFUL_NORMAL
    | VNodeFlags.COMPONENT_STATEFUL_SHOULD_KEEP_ALIVE
    | VNodeFlags.COMPONENT_STATEFUL_KEPT_ALIVE;

// 组件
VNodeFlags.COMPONENT = VNodeFlags.COMPONENT_STATEFUL | VNodeFlags.COMPONENT_FUNCTIONAL;

export default VNodeFlags;