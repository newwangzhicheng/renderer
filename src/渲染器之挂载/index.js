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

const prevVNode = h('div', {
    style: {
        width: '100px',
        height: '100px',
        backgroundColor: 'yellow'
    }
});

const nextVNode = h('div', {
    style: {
        width: '100px',
        height: '100px',
        backgroundColor: 'black'
    }
});
render(prevVNode, contaienr);
setTimeout(() => {
    render(nextVNode, contaienr);
}, 3000);