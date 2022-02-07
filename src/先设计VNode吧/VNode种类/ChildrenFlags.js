const ChildrenFlags = {
    // 未知的children类型
    UNKNOW_CHILDREN: 0,
    // 没有children
    NO_CHILDREN: 1,

    // children是单个vnode
    SINGLE_VNODE: 1 << 1,
    // children是多个有key的vnode
    KEYED_VNODES: 1 << 2,
    // children是多个没有key的vnode
    NONE_KEY_VNODES: 1 << 3
};

ChildrenFlags.MULTIPLE_VNODES = ChildrenFlags.KEYED_VNODES | ChildrenFlags.NONE_KEY_VNODES;

export default ChildrenFlags;