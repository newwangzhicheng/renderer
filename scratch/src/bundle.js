'use strict';

var vue = require('vue');

const vnode = vue.h(
  'div', 
  {
    title: 'this'
  },
  'hello'
);
console.log('vnode :>> ', vnode);
