import MyComponent from './MyComponent';

const component = MyComponent({title: '由模版引擎创造'});
document.querySelector('#app').innerHTML = component;