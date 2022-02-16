import { render } from "./render";
import { h, Fragment, Portal } from '../辅助创建VNode的h函数/h';

const contaienr = document.querySelector('#app');

/** 挂载元素节点 */
// const elementVNode = h(
//     'div',
//     {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'red'
//         }
//     }
// );
// render(elementVNode, contaienr);

/** 挂载带有子节点的元素节点 */
// const elementwithChildrenVNode = h(
//     'div',
//     {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'yellow'
//         }
//     },
//     h(
//         'div',
//         {
//             style: {
//                 height: '50px',
//                 width: '50px',
//                 background: 'green'
//             },
//             class: ['class_a', { class_b: true }, ['class_c', 'class_d']],
//             onclick: (e) => {
//                 console.log('clicked: ', e);
//             }
//         }

//     )
// );
// render(elementwithChildrenVNode, contaienr);

/** 带有必须使用dom property处理的属性 */
// const elementWithMoreAttributesVNode = h(
//     'input',
//     {
//         class: 'cls-a',
//         type: 'checkbox',
//         checked: false,
//         custom: '1'
//     }
// );
// render(elementWithMoreAttributesVNode, contaienr);

/** 带有文本的元素 */
// const elementWithTextAndFragmentVNode = h(
//     'div',
//     {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'yellow'
//         }
//     },
//     h(Fragment, null, [
//         h('div', null, '文本1'),
//         h('div', null, '文本2')
//     ])
// );
// render(elementWithTextAndFragmentVNode, contaienr);

/** 带有Portal的元素 */
// const elementWithTextAndPortalVNode = h(
//     'div',
//     {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'yellow'
//         }
//     },
//     h(Portal, { target: '#box' }, [
//         h('div', null, '标题1'),
//         h('div', null, '标题2')
//     ])
// );
// render(elementWithTextAndPortalVNode, contaienr);

/** 有状态组件 */
// class MyStatefulComponent {
//     render() {
//         return h(
//             'div',
//             {
//                 style: {
//                     height: '100px',
//                     width: '100px',
//                     background: 'red'
//                 }
//             },
//             [
//                 h('span', null, '我是组件的标题1......'),
//                 h('span', null, '我是组件的标题2......')
//             ]
//         )
//     }
// }
// const statefulComponentVNode = h(MyStatefulComponent);
// render(statefulComponentVNode, contaienr);

/** 函数式组件 */
// function MyFunctionalComponent() {
//     return h(
//         'div',
//         {
//             style: {
//                 height: '100px',
//                 width: '100px',
//                 background: 'red'
//             }
//         },
//         [
//             h('span', null, '我是组件的标题1......'),
//             h('span', null, '我是组件的标题2......')
//         ]
//     )
// }
// const functionalComponentVNode = h(MyFunctionalComponent);
// render(functionalComponentVNode, contaienr);

/** 更新VNodeData */
// const prevVNode = h('div', {
//     style: {
//         width: '100px',
//         height: '100px',
//         backgroundColor: 'yellow'
//     }
// });

// const nextVNode = h('div', {
//     style: {
//         width: '100px',
//         height: '100px',
//         backgroundColor: 'black'
//     }
// });
// render(prevVNode, contaienr);
// setTimeout(() => {
//     render(nextVNode, contaienr);
// }, 3000);

/** patch children 新旧节点的子节点样式不同*/
// 旧的 VNode
// const prevVNode = h('div', null,
//     h('p', {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'red'
//         }
//     })
// )

// // 新的 VNode
// const nextVNode = h('div', null,
//     h('p', {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'green'
//         }
//     })
// )
// render(prevVNode, contaienr);
// setTimeout(() => {
//     render(nextVNode, contaienr);
// }, 3000);

/** 旧节点有子节点 新节点没有子节点 */
// // 旧的 VNode
// const prevVNode = h(
//     'div',
//     null,
//     h('p', {
//         style: {
//             height: '100px',
//             width: '100px',
//             background: 'red'
//         }
//     })
// )

// // 新的 VNode
// const nextVNode = h('div')

// render(prevVNode, contaienr)

// // 2秒后更新
// setTimeout(() => {
//     render(nextVNode, contaienr)
// }, 3000)

/** 子节点数量不同 */
// // 旧的 VNode
// const prevVNode = h('div', null, h('p', null, '只有一个子节点'))

// // 新的 VNode
// const nextVNode = h('div', null, [
//     h('p', null, '子节点 1'),
//     h('p', null, '子节点 2')
// ])

// render(prevVNode, contaienr)

// // 2秒后更新
// setTimeout(() => {
//     render(nextVNode, contaienr)
// }, 2000)

/** 文本节点 */
// const prevVNode = h('p', null, '旧文本')

// // 新的 VNode
// const nextVNode = h('p', null, '新文本')

// render(prevVNode, contaienr)

// // 2秒后更新
// setTimeout(() => {
//     render(nextVNode, contaienr)
// }, 2000)

/** fragment 的 patch */
// const prevVNode = h(Fragment, null, [
//     h('p', null, '旧片段子节点 1'),
//     h('p', null, '旧片段子节点 2')
// ])

// const nextVNode = h(Fragment, null, [
//     h('p', null, '新片段子节点 1'),
//     h('p', null, '新片段子节点 2')
// ])

// render(prevVNode, contaienr)

// // 2秒后更新
// setTimeout(() => {
//     render(nextVNode, contaienr)
// }, 2000)

/** portal的patch */
// // 旧的 VNode
// const prevVNode = h(
//     Portal,
//     { target: '#app' },
//     h('p', null, '旧的 Portal')
// )

// // 新的 VNode
// const nextVNode = h(
//     Portal,
//     { target: '#box' },
//     h('p', null, '新的 Portal')
// )

// render(prevVNode, contaienr)

// // 2秒后更新
// setTimeout(() => {
//     render(nextVNode, contaienr)
// }, 2000)


/** 有状态组件的patch */
// class MyComponent {
//     // 自身状态 or 本地状态
//     localState = 'one'

//     // mounted 钩子
//     mounted() {
//         // 两秒钟之后修改本地状态的值，并重新调用 _update() 函数更新组件
//         setTimeout(() => {
//             this.localState = 'two'
//             this._update()
//         }, 2000)
//     }

//     render() {
//         return h('div', null, this.localState)
//     }
// }

// render(h(MyComponent), contaienr);

/** 有状态组件的更新 */
// // 组件类
// class MyComponent {
//     localState = 'one'

//     mounted() {
//         setTimeout(() => {
//             this.localState = 'two'
//             this._update()
//         }, 2000)
//     }

//     render() {
//         return h('div', null, this.localState)
//     }
// }
// // 有状态组件 VNode
// const compVNode = h(MyComponent)

// render(compVNode, contaienr)

/** props引起的有状态组件的更新 */
// class ChildComponent {
//     render() {
//         return h('div', null, this.$props.text)
//     }
// }
// // 父组件类
// class ParentComponent {
//     localState = 'one'

//     render() {
//         return h(ChildComponent, {
//             text: this.localState
//         })
//     }
// }
// // 有状态组件 VNode
// const compVNode = h(ParentComponent)

// render(compVNode, contaienr)

/** diff 算法测试， 旧>新 */
// 旧的 VNode
const prevVNode = h('div', null, [
    h('p', null, '旧的子节点1'),
    h('p', null, '旧的子节点2')
])

// 新的 VNode
const nextVNode = h('div', null, [
    h('p', null, '新的子节点1'),
    h('p', null, '新的子节点2'),
    h('p', null, '新的子节点3')
])

render(prevVNode, document.getElementById('app'))

// 2秒后更新
setTimeout(() => {
    render(nextVNode, document.getElementById('app'))
}, 2000)