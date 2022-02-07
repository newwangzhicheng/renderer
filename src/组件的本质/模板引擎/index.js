import { compiler } from './MyComponent';

const component = compiler({ title: '由模版引擎创造' });
document.querySelector('#app').innerHTML = component;