import MyComponent from './MyComponent.js';

document.querySelector('#app').innerHTML = MyComponent({
    title: '由封装的模板引擎生成'
});