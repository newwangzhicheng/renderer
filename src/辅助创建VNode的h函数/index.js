import { h, Fragment, Portal } from './h';

const fragment = h(Fragment, {
    target: '#app'
}, [
    h('td'),
    h('td')
]);
console.log('fragment :>> ', fragment);

const portal = h(Portal, { target: '#box' }, h('h1'));
console.log('portal :>> ', portal);

function MyFunctionalComponent() { }
const functionalVNode = h(MyFunctionalComponent, null, h('div'));
console.log('functionalVNode :>> ', functionalVNode);

class Component {
    render() {
        throw '缺少render函数';
    }
}
class MyStatefulComponent extends Component {
    render() {

    }
}
const statefulVNode = h(MyStatefulComponent, null, h('div'));
console.log('StatefulVNode :>> ', statefulVNode);